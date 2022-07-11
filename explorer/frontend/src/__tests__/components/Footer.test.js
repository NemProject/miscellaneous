/* eslint-disable testing-library/no-node-access */
import { Footer } from '../../components/Footer/Footer';
import { render, screen } from '@testing-library/react';

describe('components/Footer', () => {
	it('should render logo', async () => {
		// Arrange:
		const logoAltText = 'nem-logo';

		// Act:
		render(<Footer />);

		// Assert:
		expect(screen.getByAltText(logoAltText)).toBeInTheDocument();
	});
});
