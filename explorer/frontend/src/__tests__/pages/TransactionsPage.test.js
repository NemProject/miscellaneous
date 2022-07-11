/* eslint-disable testing-library/no-node-access */
import { TransactionsPage } from '../../pages/TransactionsPage/TransactionsPage';
import { render, screen } from '@testing-library/react';

describe('pages/TransactionsPage', () => {
	it('should render the title text', async () => {
		// Arrange:
		const titleText = 'Transactions';

		// Act:
		render(<TransactionsPage />);

		// Assert:
		expect(screen.getByText(titleText)).toBeInTheDocument();
	});
});
