import argparse

import yaml
from symbolchain.core.BufferWriter import BufferWriter
from symbolchain.core.CryptoTypes import Hash256, PrivateKey, PublicKey, Signature
from symbolchain.core.nem.KeyPair import KeyPair
from symbolchain.core.nem.Network import Address
from symbolchain.core.nem.Network import Network as NemNetwork
from symbolchain.core.nem.TransferTransaction import TransferTransaction
from symbolchain.core.Network import NetworkLocator
from zenlog import log

MICROXEM_PER_XEM = 1000000
ENTITY_HEADER_SIZE = 48  # excluding signature


def zero_transaction_fee(payload):
    # payload is unsigned transaction (without signature)
    writer = BufferWriter()
    writer.write_bytes(payload[:ENTITY_HEADER_SIZE])
    writer.write_int(0, 8)
    writer.write_bytes(payload[ENTITY_HEADER_SIZE + 8:])
    return writer.buffer


def attach_signature(payload, signature, prepend_size=False):
    # payload is unsigned block or transaction (without signature)
    writer = BufferWriter()

    if prepend_size:
        writer.write_int(len(payload) + 4 + Signature.SIZE, 4)

    writer.write_bytes(payload[:ENTITY_HEADER_SIZE])

    writer.write_int(Signature.SIZE, 4)
    writer.write_bytes(signature.bytes)

    writer.write_bytes(payload[ENTITY_HEADER_SIZE:])
    return writer.buffer


class Generator:
    def __init__(self, input_file):
        with open(input_file, 'rt', encoding='utf8') as infile:
            nemesis_config = yaml.load(infile, yaml.SafeLoader)

            self.signer_key_pair = KeyPair(PrivateKey(nemesis_config['signer_private_key']))
            self.generation_hash = Hash256(nemesis_config['generation_hash'])
            self.accounts = nemesis_config['accounts']

        self.network = NetworkLocator().find_by_name(NemNetwork.NETWORKS, nemesis_config['network'])
        self.unsigned_transaction_payloads = []
        self.signed_transaction_payloads = []
        self.signed_block_header = None

    def print_header(self):
        signer_address = self.network.public_key_to_address(self.signer_key_pair.public_key)
        total_xem = sum([account['amount'] for account in self.accounts]) / MICROXEM_PER_XEM

        log.info('Preparing Nemesis Block')
        log.info(f' *  SIGNER ADDRESS: {signer_address}')
        log.info(f' * GENERATION HASH: {self.generation_hash}')
        log.info(f' *  TOTAL ACCOUNTS: {len(self.accounts)}')
        log.info(f' *       TOTAL XEM: {total_xem:.6f}')

    def prepare_transactions(self):
        for transaction_descriptor in self.accounts:
            self._serialize_and_sign_transaction(transaction_descriptor)

    def _serialize_and_sign_transaction(self, transaction_descriptor):
        transaction = TransferTransaction(self.network)
        transaction.signer_public_key = self.signer_key_pair.public_key
        transaction.recipient_address = Address(transaction_descriptor['address'])
        transaction.amount = transaction_descriptor['amount']
        unsigned_payload = zero_transaction_fee(transaction.serialize())

        self.unsigned_transaction_payloads.append(unsigned_payload)
        signature = self.signer_key_pair.sign(unsigned_payload)
        signed_payload = attach_signature(unsigned_payload, signature, prepend_size=True)
        self.signed_transaction_payloads.append(signed_payload)

    def prepare_block(self):
        writer = BufferWriter()
        writer.write_int(0xFFFFFFFF, 4)  # type
        self._write_entity_header(writer)

        writer.write_int(Hash256.SIZE + 4, 4)
        writer.write_int(Hash256.SIZE, 4)
        writer.write_bytes(self.generation_hash.bytes)

        writer.write_int(1, 8)  # height

        writer.write_int(len(self.unsigned_transaction_payloads), 4)  # transactions count

        unsigned_block_header = writer.buffer[:]

        for unsigned_transaction_payload in self.unsigned_transaction_payloads:
            writer.write_bytes(unsigned_transaction_payload)

        unsigned_block = writer.buffer
        signature = self.signer_key_pair.sign(unsigned_block)
        self.signed_block_header = attach_signature(unsigned_block_header, signature)

    def _write_entity_header(self, writer):
        writer.write_int(1, 1)  # version
        writer.write_int(0, 2)  # padding
        writer.write_int(self.network.identifier, 1)  # network
        writer.write_int(0, 4)  # timestamp

        writer.write_int(PublicKey.SIZE, 4)
        writer.write_bytes(self.signer_key_pair.public_key.bytes)

    def save(self, output_file):
        with open(output_file, 'wb') as outfile:
            outfile.write(self.signed_block_header)
            for signed_transaction_payload in self.signed_transaction_payloads:
                outfile.write(signed_transaction_payload)


def main():
    program_name = None
    if globals().get('__spec__'):
        program_name = __spec__.name.partition('.')[0]

    parser = argparse.ArgumentParser(
        prog=None if not program_name else f'python -m {program_name}',
        description='NEM nemesis block generator'
    )
    parser.add_argument('-i', '--input', help='nemesis configuration', required=True)
    parser.add_argument('-o', '--output', help='nemesis binary file', required=True)
    args = parser.parse_args()

    generator = Generator(args.input)
    generator.print_header()

    generator.prepare_transactions()
    generator.prepare_block()
    generator.save(args.output)


if '__main__' == __name__:
    main()
