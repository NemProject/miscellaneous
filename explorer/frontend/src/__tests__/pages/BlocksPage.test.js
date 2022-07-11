/* eslint-disable testing-library/no-node-access */
import { BlocksPage } from '../../pages/BlocksPage/BlocksPage';
import { render, screen } from '@testing-library/react';

describe('pages/BasePage', () => {
	it('should render the title text', async () => {
		// Arrange:
		const titleText = 'Blocks';

		// Act:
		render(<BlocksPage />);

		// Assert:
		expect(screen.getByText(titleText)).toBeInTheDocument();
	});
});
