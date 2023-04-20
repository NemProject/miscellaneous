import { TransactionService } from '../../services/TransactionService';
import * as utils from '../../utils/helper';

const config = {
	API_BASE_URL: 'http://base'
};

jest.mock('../../config', () => config);

describe('services/TransactionService', () => {
	describe('getTransactionList()', () => {
		it('should fetch transaction list', async () => {
			// Arrange:
			const expectedResult = 'transactions';
			const pageNumber = 1;
			const method = 'POST';
			const endpoint = `${config.API_BASE_URL}/tx/list`;
			const body = {
				page: pageNumber,
				transactionType: ''
			};
			const fetchMock = jest
				.spyOn(utils, 'makeRequest')
				.mockImplementation(jest.fn())
				.mockResolvedValue({
					json: jest.fn().mockResolvedValue(expectedResult)
				});

			// Act:
			const result = await TransactionService.getTransactionList(pageNumber);

			// Assert:
			expect(fetchMock).toBeCalledWith(method, endpoint, body);
			expect(result).toBe(expectedResult);
		});
	});

	describe('getTransactionDetails()', () => {
		it('should fetch transaction details', async () => {
			// Arrange:
			const expectedResult = 'transaction';
			const hash = 'hash';
			const method = 'POST';
			const endpoint = `${config.API_BASE_URL}/tx/tx`;
			const body = {
				hash
			};
			const fetchMock = jest
				.spyOn(utils, 'makeRequest')
				.mockImplementation(jest.fn())
				.mockResolvedValue({
					json: jest.fn().mockResolvedValue(expectedResult)
				});

			// Act:
			const result = await TransactionService.getTransactionDetails(hash);

			// Assert:
			expect(fetchMock).toBeCalledWith(method, endpoint, body);
			expect(result).toBe(expectedResult);
		});
	});
});
