import argparse
import json
import os
import shutil
from pathlib import Path

import yaml

MICROXEM_PER_XEM = 1000000


def _save_user_configuration(output_filepath, prepare_replacements):
	configuration = f'''
nis.bootKey = {prepare_replacements['boot_key']}
nis.bootName = {prepare_replacements['boot_name']}
nem.host = {prepare_replacements['host']}

nis.ipDetectionMode = Disabled

nem.network = {prepare_replacements['network_friendly_name']}
nem.network.version = {prepare_replacements['network_version']}
nem.network.addressStartChar = {prepare_replacements['address_start_char']}
nem.network.generationHash = {prepare_replacements['generation_hash']}
nem.network.nemesisSignerAddress = {prepare_replacements['nemesis_address']}
nem.network.totalAmount = {prepare_replacements['total_amount']}
nem.network.nemesisFilePath = nemesis.bin

nis.treasuryReissuanceForkHeight = 1
nis.treasuryReissuanceForkTransactionHashes =
nis.treasuryReissuanceForkFallbackTransactionHashes =
nis.multisigMOfNForkHeight = 1
nis.mosaicsForkHeight = 1
nis.firstFeeForkHeight = 1
nis.secondFeeForkHeight = 1
nis.remoteAccountForkHeight = 1
nis.mosaicRedefinitionForkHeight = 1
	'''

	_save_user_configuration_file(output_filepath / 'config-user.properties', configuration)


def _create_known_peers(accounts, nodes):
	peers_descriptors = [{
		'endpoint': {
			'host': node['host'],
			'port': 7890,
			'protocol': 'http'
		},
		'identity': {
			'name': node['name'],
			'public-key': account['publickey']
		},
	} for node, account in zip(nodes, accounts)]

	return {
		'_info': 'this file contains a list of all trusted peers and can be shared',
		'knownPeers': peers_descriptors
	}


def save_network_configuration(args):
	user_configuration = _read_yaml_configuration_file(args.accounts_file)
	accounts = user_configuration['accounts']

	nodes = _read_yaml_configuration_file(args.nodes_file)['nodes']
	known_peers = _create_known_peers(accounts, nodes)

	nemesis = _read_yaml_configuration_file(args.nemesis_file)
	network_friendly_name = nemesis['network'] + ('2' if args.network_friendly_name is None else f'_{args.network_friendly_name}')
	total_xem = int(sum(account['amount'] for account in nemesis['accounts']) / MICROXEM_PER_XEM)

	for node, account in zip(nodes, accounts):
		path = Path(args.output_path) / node['name']
		os.makedirs(path, exist_ok=True)

		_save_user_configuration(path, {
			'boot_key': account['privatekey'],
			'boot_name': node['name'],
			'host': node['host'],
			'generation_hash': user_configuration['generation_hash'],
			'nemesis_address': user_configuration['nemesis']['address'],
			'total_amount': total_xem,
			'network': nemesis['network'],
			'network_friendly_name': network_friendly_name,
			'network_version': nemesis['identifier'],
			'address_start_char': user_configuration['nemesis']['address'][0]
		})

		_save_json_configuration_file(path / f'peers-config_{network_friendly_name}.json', known_peers)

		shutil.copy(args.seed, path)


def _save_json_configuration_file(output_filepath, configuration):
	with open(output_filepath, 'wt', encoding='utf8') as configuration_file:
		json.dump(configuration, configuration_file, indent=4)


def _save_user_configuration_file(output_filepath, configuration):
	with open(output_filepath, 'wt', encoding='utf8') as configuration_file:
		configuration_file.write(configuration)


def _read_yaml_configuration_file(input_file):
	with open(input_file, 'rt', encoding='utf8') as infile:
		return yaml.load(infile, yaml.SafeLoader)


def main():
	run_command_name = None
	if globals().get('__spec__'):
		program_name = __spec__.name.partition('.')[0]
		run_command_name = f'python -m {program_name}'

	parser = argparse.ArgumentParser(prog=run_command_name, description='NEM nemesis configuration generator')
	parser.add_argument('-a', '--accounts-file', help='Accounts in the nemesis', required=True)
	parser.add_argument('-b', '--nodes-file', help='Nodes in the network', required=True)
	parser.add_argument('-n', '--nemesis-file', help='Nemesis configuration file', required=True)
	parser.add_argument('-s', '--seed', help='Nemesis file for the network', required=True)
	parser.add_argument('-o', '--output-path', help='Output path for the configuration', required=True)
	parser.add_argument('-f', '--network-friendly-name', help='Friendly name for the network')
	args = parser.parse_args()

	save_network_configuration(args)


if '__main__' == __name__:
	main()
