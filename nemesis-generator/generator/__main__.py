import argparse

import yaml
from symbolchain.BufferWriter import BufferWriter
from symbolchain.CryptoTypes import Hash256, PrivateKey, PublicKey, Signature
from symbolchain.facade.NemFacade import NemFacade
from symbolchain.nem.Network import Network
from symbolchain.nem.TransactionFactory import TransactionFactory
from zenlog import log

MICROXEM_PER_XEM = 1000000
ENTITY_HEADER_SIZE = 48  # excluding signature


def prepend_size(payload):
	writer = BufferWriter()
	writer.write_int(len(payload), 4)
	writer.write_bytes(payload)
	return writer.buffer


def attach_signature(payload, signature):
	# payload is unsigned block or transaction (without signature)
	writer = BufferWriter()

	writer.write_bytes(payload[:ENTITY_HEADER_SIZE])
	writer.write_int(Signature.SIZE, 4)
	writer.write_bytes(signature.bytes)

	writer.write_bytes(payload[ENTITY_HEADER_SIZE:])
	return writer.buffer


def patch_network_identifier(payload, identifier):
	payload[4 + 1 + 2] = identifier


class Generator:
	# pylint: disable=too-many-instance-attributes
	def __init__(self, input_file):
		with open(input_file, 'rt', encoding='utf8') as infile:
			nemesis_config = yaml.load(infile, yaml.SafeLoader)

			self.facade = NemFacade(nemesis_config['network'])
			self.network_identifier = nemesis_config['identifier']
			self.epoch_time = nemesis_config['epoch_time']

			self.signer_key_pair = self.facade.KeyPair(PrivateKey(nemesis_config['signer_private_key']))
			self.generation_hash = Hash256(nemesis_config['generation_hash'])
			self.accounts = nemesis_config['accounts']

		self.unsigned_transaction_payloads = []
		self.signed_transaction_payloads = []
		self.signed_block_header = None

	def print_header(self):
		network = Network('', self.network_identifier, self.epoch_time)
		signer_address = network.public_key_to_address(self.signer_key_pair.public_key)
		total_xem = sum(account['amount'] for account in self.accounts) / MICROXEM_PER_XEM

		log.info('Preparing Nemesis Block')
		log.info(f' *  SIGNER ADDRESS: {signer_address}')
		log.info(f' * GENERATION HASH: {self.generation_hash}')
		log.info(f' *  TOTAL ACCOUNTS: {len(self.accounts)}')
		log.info(f' *       TOTAL XEM: {total_xem:.6f}')

	def prepare_transactions(self):
		for transaction_descriptor in self.accounts:
			self._serialize_and_sign_transaction(transaction_descriptor)

	def _serialize_and_sign_transaction(self, transaction_descriptor):
		# note: zero fee
		transaction = self.facade.transaction_factory.create({
			'type': 'transfer_transaction_v1',
			'signer_public_key': self.signer_key_pair.public_key,
			'recipient_address': transaction_descriptor['address'],
			'amount': transaction_descriptor['amount']
		})
		unsigned_payload = self.facade.transaction_factory.to_non_verifiable_transaction(transaction).serialize()
		self.unsigned_transaction_payloads.append(unsigned_payload)

		# manually serialize and sign, in order to patch network byte
		non_verifiable_transaction = TransactionFactory.to_non_verifiable_transaction(transaction)
		unsigned_transaction_payload = bytearray(non_verifiable_transaction.serialize())
		patch_network_identifier(unsigned_transaction_payload, self.network_identifier)
		signature = self.signer_key_pair.sign(bytes(unsigned_transaction_payload))
		self.facade.transaction_factory.attach_signature(transaction, signature)

		# patch network byte in final tx
		transaction_payload = bytearray(transaction.serialize())
		patch_network_identifier(transaction_payload, self.network_identifier)
		signed_payload = prepend_size(transaction_payload)
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
		writer.write_int(self.network_identifier, 1)  # network
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
