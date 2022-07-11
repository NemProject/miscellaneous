/* eslint-disable testing-library/no-node-access */
import { HomePage } from '../../pages/HomePage/HomePage';
import { BlockService } from '../../services/BlockService';
import { render, screen } from '@testing-library/react';

describe('pages/HomePage', () => {
	it('should render recent blocks', async () => {
		// Arrange:
		const blockList = [
			{
				height: 98723,
				harvester: 'harvesteraddress',
				txes: {
					length: 2
				},
				timeStamp: 123123123
			}
		];
		jest.spyOn(BlockService, 'getBlockList').mockResolvedValue(blockList);

		// Act:
		render(<HomePage />);

		// Assert:
		await screen.findByText('98723');
		expect(screen.getByText('harvesteraddress')).toBeInTheDocument();
	});
});
