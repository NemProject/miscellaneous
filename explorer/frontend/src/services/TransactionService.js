import config from '../config';
import { makeRequest } from '../utils';

export class TransactionService {
	/**
   * Fetches the transaction list.
   * @param {number} pageNumber - page number.
   * @param {number} [transactionType] - transaction type to filter.
   * @returns {Array<object>} transaction list page.
   */
	static async getTransactionList(pageNumber, transactionType = '') {
		const endpoint = `${config.API_BASE_URL}/tx/list`;
		const body = {
			page: pageNumber,
			transactionType
		};
		const response = await makeRequest('POST', endpoint, body);
		const transactionListDTO = await response.json();

		return transactionListDTO;
	}

	/**
   * Fetches the transaction details.
   * @param {number} hash - the hash of a transaction to search.
   * @returns {object} transaction details.
   */
	static async getTransactionDetails(hash) {
		const endpoint = `${config.API_BASE_URL}/tx/tx`;
		const body = {
			hash
		};
		const response = await makeRequest('POST', endpoint, body);
		const transactionDetailsDTO = await response.json();

		return transactionDetailsDTO;
	}
}
