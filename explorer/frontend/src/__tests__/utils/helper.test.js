import {
	createParagraph,
	encodeQueryParams,
	formatDate,
	formatNullableText,
	makeRequest,
	numberToShortString,
	timeSince
} from '../../utils';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Enzyme, { shallow } from 'enzyme';
import React from 'react';

Enzyme.configure({ adapter: new Adapter() });

const mockTranslate = key => {
	return 'translated_' + key;
};

const config = {
	NEM_EPOCH: '1427587585000'
};

jest.mock('../../config', () => config);

describe('utils/helper', () => {
	describe('createParagraph()', () => {
		it('should return React fragment with 2 paragraphs when string with 1 line break provided', () => {
			// Arrange:
			const firstLine =
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit,';
			const secondLine =
        'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
			const lineBreak = '\n';
			const text = firstLine + lineBreak + secondLine; // max-len error workaround.

			// Act:
			const Component = () => createParagraph(text);
			const wrapper = shallow(<Component />);

			// Assert:
			expect(wrapper.equals(<React.Fragment>
				<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit,</p>
				<p>
              sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
				</p>
			</React.Fragment>)).toBe(true);
		});
	});

	describe('formatNullableText()', () => {
		it('should return formatted null', () => {
			// Arrange:
			const value = null;
			const expectedResult = '-';

			// Act:
			const result = formatNullableText(value);

			// Assert:
			expect(result).toBe(expectedResult);
		});

		it('should return unchanged value', () => {
			// Arrange:
			const value = 'text';
			const expectedResult = 'text';

			// Act:
			const result = formatNullableText(value);

			// Assert:
			expect(result).toBe(expectedResult);
		});
	});

	describe('formatDate()', () => {
		it('should return correct date string', () => {
			// Arrange:
			const date = new Date(2022, 4, 9, 23, 10, 12, 33).toISOString();

			// Act:
			const formattedDate = formatDate(date, mockTranslate);

			// Assert:
			expect(formattedDate).toBe('translated_month_may 9, 2022');
		});

		it('should return correct date string without translation', () => {
			// Arrange:
			const date = new Date(2022, 4, 9, 23, 10, 12, 33).toISOString();

			// Act:
			const formattedDate = formatDate(date);

			// Assert:
			expect(formattedDate).toBe('may 9, 2022');
		});

		it('should return correct date and time string', () => {
			// Arrange:
			const date = new Date(2022, 4, 9, 23, 10, 12, 33).toISOString();

			// Act:
			const formattedDate = formatDate(date, mockTranslate, true);

			// Assert:
			expect(formattedDate).toBe('translated_month_may 9, 2022 23:10:12');
		});
	});

	describe('numberToShortString()', () => {
		it('should return formatted thousand', () => {
			// Arrange:
			const value = 1234;
			const expectedResult = '1.23K';

			// Act:
			const result = numberToShortString(value);

			// Assert:
			expect(result).toBe(expectedResult);
		});

		it('should return formatted million', () => {
			// Arrange:
			const value = 1_234_567;
			const expectedResult = '1.23M';

			// Act:
			const result = numberToShortString(value);

			// Assert:
			expect(result).toBe(expectedResult);
		});

		it('should return unformatted number', () => {
			// Arrange:
			const value = 123;
			const expectedResult = '123';

			// Act:
			const result = numberToShortString(value);

			// Assert:
			expect(result).toBe(expectedResult);
		});
	});

	describe('encodeQueryParams()', () => {
		it('should return valid query string', async () => {
			// Arrange:
			const params = {
				param1: true,
				param2: 123,
				param3: null,
				param4: 'value',
				param5: undefined,
				param6: ['value', 123, null],
				param7: () => {},
				param8: {
					key: 'value'
				}
			};
			const expectedQueryString = 'param1=true&param2=123&param4=value';

			// Act:
			const queryString = encodeQueryParams(params);

			// Assert:
			expect(queryString).toBe(expectedQueryString);
		});
	});

	describe('makeRequest()', () => {
		it('should make post request', async () => {
			// Arrange:
			const method = 'post';
			const url = 'url';
			const body = {
				key: 'value'
			};
			const expectedFetchCallArguments = [
				url,
				{
					method,
					body: JSON.stringify(body)
				}
			];
			const fetchMock = jest
				.spyOn(global, 'fetch')
				.mockImplementation(jest.fn());

			// Act:
			await makeRequest(method, url, body);

			// Assert:
			expect(fetchMock).toBeCalledWith(...expectedFetchCallArguments);
		});

		it('should make get request', async () => {
			// Arrange:
			const method = 'get';
			const url = 'url';
			const expectedFetchCallArguments = [
				url,
				{
					method
				}
			];
			const fetchMock = jest
				.spyOn(global, 'fetch')
				.mockImplementation(jest.fn());

			// Act:
			await makeRequest(method, url);

			// Assert:
			expect(fetchMock).toBeCalledWith(...expectedFetchCallArguments);
		});
	});

	describe('timeSince()', () => {
		const runTimeSinceTest = async (time, expectedResult) => {
			// Arrange:
			const preparedTimeToTest =
        (Date.now() - config.NEM_EPOCH - (time * 1000)) / 1000;

			// Act:
			const result = timeSince(preparedTimeToTest, mockTranslate);

			// Assert:
			expect(result).toBe(expectedResult);
		};

		it('should return 10 seconds', async () => {
			// Arrange:
			const time = 10;
			const expectedResult =
        '10 translated_time_short_seconds translated_time_ago';

			// Act + Assert:
			await runTimeSinceTest(time, expectedResult);
		});

		it('should return 10 minutes', async () => {
			// Arrange:
			const time = (10 * 60) + 5;
			const expectedResult =
        '10 translated_time_short_minutes translated_time_ago';

			// Act + Assert:
			await runTimeSinceTest(time, expectedResult);
		});

		it('should return 2 hours', async () => {
			// Arrange:
			const time = (2 * 60 * 60) + (10 * 60) + 5;
			const expectedResult =
        '2 translated_time_short_hours translated_time_ago';

			// Act + Assert:
			await runTimeSinceTest(time, expectedResult);
		});

		it('should return 1 day', async () => {
			// Arrange:
			const time = (1 * 24 * 60 * 60) + (3 * 60 * 60) + (10 * 60) + 5;
			const expectedResult = '1 translated_time_short_days translated_time_ago';

			// Act + Assert:
			await runTimeSinceTest(time, expectedResult);
		});
	});
});
