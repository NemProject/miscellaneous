import config from '../config';
import { makeRequest } from '../utils';

export class BlockService {
	/**
   * Fetches the block list.
   * @param {number} pageNumber - page number.
   * @returns {Array<object>} block list page.
   */
	static async getBlockList(pageNumber) {
		const endpoint = `${config.API_BASE_URL}/block/list`;
		const body = {
			page: pageNumber
		};
		const response = await makeRequest('POST', endpoint, body);
		const blockListDTO = await response.json();

		return blockListDTO;
	}

	/**
   * Fetches the block details.
   * @param {number} height - the height of a block to search.
   * @returns {object} block details.
   */
	static async getBlockDetails(height) {
		const endpoint = `${config.API_BASE_URL}/block/blockAtBySearch`;
		const body = {
			height
		};
		const response = await makeRequest('POST', endpoint, body);
		const blockDetailsDTO = await response.json();

		return blockDetailsDTO;
	}
}
