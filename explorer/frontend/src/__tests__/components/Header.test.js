/* eslint-disable testing-library/no-node-access */
import { Header } from '../../components/Header/Header';
import { BrowserRouter } from '../../router';
import { render, screen } from '@testing-library/react';

describe('components/Header', () => {
	it('should render logo', async () => {
		// Arrange:
		const logoAltText = 'nem-logo';

		// Act:
		render(<BrowserRouter>
			<Header />
		</BrowserRouter>);

		// Assert:
		expect(screen.getByAltText(logoAltText)).toBeInTheDocument();
	});
});
