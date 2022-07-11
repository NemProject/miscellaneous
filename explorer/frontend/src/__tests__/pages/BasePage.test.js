/* eslint-disable testing-library/no-node-access */
import { BasePage } from '../../pages/BasePage/BasePage';
import { render, screen } from '@testing-library/react';

jest.mock('../../components/Header/Header', () => ({
	Header: () => <div>Header</div>
}));
jest.mock('../../components/Footer/Footer', () => ({
	Footer: () => <div>Footer</div>
}));

describe('pages/BasePage', () => {
	it('should render child component with Header and Footer', async () => {
		// Arrange:
		const ChildComponent = () => <div>Child</div>;

		// Act:
		render(<BasePage>
			<ChildComponent />
		</BasePage>);

		// Assert:
		expect(screen.getByText('Header')).toBeInTheDocument();
		expect(screen.getByText('Child')).toBeInTheDocument();
		expect(screen.getByText('Footer')).toBeInTheDocument();
	});
});
