import { BlockService } from '../../services/BlockService';
import * as utils from '../../utils/helper';

const config = {
	API_BASE_URL: 'http://base'
};

jest.mock('../../config', () => config);

describe('services/BlockService', () => {
	describe('getBlockList()', () => {
		it('should fetch block list', async () => {
			// Arrange:
			const expectedResult = 'blocks';
			const pageNumber = 1;
			const method = 'POST';
			const endpoint = `${config.API_BASE_URL}/block/list`;
			const body = {
				page: pageNumber
			};
			const fetchMock = jest
				.spyOn(utils, 'makeRequest')
				.mockImplementation(jest.fn())
				.mockResolvedValue({
					json: jest.fn().mockResolvedValue(expectedResult)
				});

			// Act:
			const result = await BlockService.getBlockList(pageNumber);

			// Assert:
			expect(fetchMock).toBeCalledWith(method, endpoint, body);
			expect(result).toBe(expectedResult);
		});
	});

	describe('getBlockDetails()', () => {
		it('should fetch block details', async () => {
			// Arrange:
			const expectedResult = 'block';
			const height = 9801;
			const method = 'POST';
			const endpoint = `${config.API_BASE_URL}/block/blockAtBySearch`;
			const body = {
				height
			};
			const fetchMock = jest
				.spyOn(utils, 'makeRequest')
				.mockImplementation(jest.fn())
				.mockResolvedValue({
					json: jest.fn().mockResolvedValue(expectedResult)
				});

			// Act:
			const result = await BlockService.getBlockDetails(height);

			// Assert:
			expect(fetchMock).toBeCalledWith(method, endpoint, body);
			expect(result).toBe(expectedResult);
		});
	});
});
