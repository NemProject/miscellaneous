#!/usr/bin/env bash
set -eu

if [[ "$*" =~ nis || "$#" == 0 ]]; then
# we run the setup only if nis is run
  ./setup.sh
fi

# we rebuild and remove existing container every time. 
# The benefits: upgrades are automatic after the git pull
docker build --rm=false --tag mynem_image  --build-arg USER_ID="$(id -u)" .
docker ps -a | grep mynem_container > /dev/null && docker rm mynem_container

# determine which custom configs to mount
set -x
config_mounts=""
# nis.config-user.properties.sample  servant.config.properties.sample  supervisord.conf.sample
# - nis
config_file="${PWD}/custom-configs/nis.config-user.properties"
[[ -f "${config_file}" ]] && config_mounts="${config_mounts} -v ${config_file}:/package/nis/config-user.properties"

# - servant
config_file="${PWD}/custom-configs/servant.config.properties"
[[ -f $config_file ]] && config_mounts="${config_mounts} -v ${config_file}:/servant/config.properties"

# - supervisord
config_file="${PWD}/custom-configs/supervisord.conf"
[[ -f "${config_file}" ]] && config_mounts="${config_mounts} -v ${config_file}:/etc/supervisord.conf"

nem_folder="${PWD}/nem"
if [[ ! -d "${nem_folder}" ]]; then
  echo "Creating nem folder"
  mkdir -p "${nem_folder}"/nis
fi

command="docker run --restart always --name mynem_container -v ${PWD}/nem:/home/nem/nem ${config_mounts} -t -d  -p 7777:7777 -p 7778:7778 -p 7880:7880 -p 7890:7890 mynem_image"
${command}
set +x

if [[ "$*" =~ nis || "$#" == 0 ]]; then
  echo "Starting NIS"
  ./supervisorctl.sh start nis
fi

echo "All done, here are the services running:"
echo -e "\e[34m"
./supervisorctl.sh status
echo -e "\e[39m"
echo
echo -e "\e[32m--------------------------------------------------------------------------------"
echo "You can control the 'nis' service with the script ./service.sh"
echo "run ./service.sh without argument to get help"
echo
echo "You can access the supervisord control shell with ./supervisorctl.sh"
echo -e "--------------------------------------------------------------------------------\e[39m"
