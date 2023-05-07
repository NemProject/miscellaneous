#!/bin/bash

if [[ "$#" -lt 1 ]]; then
  echo "Usage: $0 [start|stop|restart|status] [nis]"
  exit 1
fi

./supervisorctl.sh "$@"

while ./supervisorctl.sh status "$2" | grep -E "STARTING > /dev/null"  ; do
  echo "Process starting, waiting for result"
  sleep 1
done

if ./supervisorctl.sh status "$2" | grep -E "FATAL|BACKOFF"  ; then
  echo "Starting service failed, you might have some info in the logs below:"
  ./supervisorctl.sh tail "$2" | tail -n 10
fi
