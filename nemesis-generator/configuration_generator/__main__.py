import argparse
import secrets

import yaml
from symbolchain.core.CryptoTypes import Hash256, PrivateKey
from symbolchain.core.facade.NemFacade import NemFacade
from zenlog import log

MICROXEM_PER_XEM = 1000000


class NemesisConfigurationGenerator:
    def __init__(self, network):
        self.facade = NemFacade(network)
        self.signer_private_key_pair = self.facade.KeyPair(PrivateKey.random())
        self.generation_hash = Hash256(self._random_bytes(Hash256.SIZE))
        self.account_key_pairs = []

    def print_header(self, amount):
        signer_address = self.facade.network.public_key_to_address(self.signer_private_key_pair.public_key)
        total_xem = (len(self.account_key_pairs) * amount) / MICROXEM_PER_XEM

        log.info('Generated Nemesis Configuration')
        log.info(f' *  SIGNER ADDRESS: {signer_address}')
        log.info(f' * GENERATION HASH: {self.generation_hash}')
        log.info(f' *  TOTAL ACCOUNTS: {len(self.account_key_pairs)}')
        log.info(f' *       TOTAL XEM: {total_xem:.6f}')

    def generate_keys(self, count):
        self.account_key_pairs = [self.facade.KeyPair(PrivateKey.random()) for _ in range(0, count)]

    def save_nemesis_configuration(self, amount, network_name, output_filepath):
        accounts = [{
            'address': str(self.facade.network.public_key_to_address(key_pair.public_key)),
            'amount': amount
        } for key_pair in self.account_key_pairs]

        configuration = {
            'signer_private_key': str(self.signer_private_key_pair.private_key),
            'generation_hash': str(self.generation_hash),
            'network': network_name,
            'accounts': accounts
        }

        self._save_configuration_file(output_filepath, configuration)

    def save_account_configuration(self, output_filepath):
        account_descriptors = [{
            'privatekey': str(key_pair.private_key),
            'publickey': str(key_pair.public_key),
            'address': str(self.facade.network.public_key_to_address(key_pair.public_key))
        } for key_pair in self.account_key_pairs]

        configuration = {
            'generation_hash': str(self.generation_hash),
            'accounts': account_descriptors,
            'nemesis': {
                'privatekey': str(self.signer_private_key_pair.private_key),
                'publickey': str(self.signer_private_key_pair.public_key),
                'address': str(self.facade.network.public_key_to_address(self.signer_private_key_pair.public_key))
            }
        }

        self._save_configuration_file(output_filepath, configuration)

    @staticmethod
    def _save_configuration_file(output_filepath, configuration):
        with open(output_filepath, 'wt', encoding='utf8') as configuration_file:
            yaml.dump(configuration, configuration_file)

    @staticmethod
    def _random_bytes(size):
        return secrets.token_bytes(size)


def main():
    run_command_name = None
    if globals().get('__spec__'):
        program_name = __spec__.name.partition('.')[0]
        run_command_name = f'python -m {program_name}'

    parser = argparse.ArgumentParser(
        prog=run_command_name,
        description='NEM nemesis configuration generator'
    )
    parser.add_argument('-c', '--count', type=int, help='Number of accounts in the nemesis', required=True)
    parser.add_argument('-s', '--seed', type=int, help='Seed amount', required=True)
    parser.add_argument('-o', '--output', help='Nemesis configuration file', required=True)
    parser.add_argument('-a', '--accounts-output', help='Account configuration file', required=True)
    parser.add_argument('-n', '--network-name', help='Network name', choices=('mainnet', 'testnet'), required=True)
    args = parser.parse_args()

    generator = NemesisConfigurationGenerator(args.network_name)
    generator.generate_keys(args.count)
    generator.save_nemesis_configuration(args.seed, args.network_name, args.output)
    generator.save_account_configuration(args.accounts_output)
    generator.print_header(args.seed)


if '__main__' == __name__:
    main()
