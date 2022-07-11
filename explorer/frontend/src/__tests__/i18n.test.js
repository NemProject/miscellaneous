let i18n;

beforeEach(() => {
	jest.mock(
		'../locales/en.json',
		() => ({
			key1: 'value1',
			key2: 'value2'
		}),
		{ virtual: true }
	);
	({ i18n } = require('../i18n'));
});

describe('i18n', () => {
	it('should set language', () => {
		// Arrange:
		const language = 'en';

		// Act:
		i18n.setCurrentLanguage(language);
		const currentLanguage = i18n.getCurrentLanguage();

		// Assert:
		expect(currentLanguage).toBe(language);
	});

	it('should return default language when unsupported stored in localStorage', () => {
		// Arrange:
		const defaultLanguage = 'en';
		const unsupportedLanguage = 'unsupported';

		// Act:
		global.localStorage.setItem('currentLanguage', unsupportedLanguage);
		const currentLanguage = i18n.getCurrentLanguage();

		// Assert:
		expect(currentLanguage).toBe(defaultLanguage);
	});

	it('should throw an error when set unsupported language', () => {
		// Arrange:
		const unsupportedLanguage = 'unsupported';
		const setUnsupportedLanguageFunction = () =>
			i18n.setCurrentLanguage(unsupportedLanguage);

		// Act & Assert:
		expect(setUnsupportedLanguageFunction).toThrow();
	});

	it('should return valid translation by given key', () => {
		// Arrange:
		const key1 = 'key1';
		const key2 = 'key2';
		const expectedTranslation1 = 'value1';
		const expectedTranslation2 = 'value2';

		// Act:
		const translation1 = i18n.getCopy(key1);
		const translation2 = i18n.getCopy(key2);

		// Assert:
		expect(translation1).toBe(expectedTranslation1);
		expect(translation2).toBe(expectedTranslation2);
	});

	it('should return missing translation message', () => {
		// Arrange:
		const key = 'invalid_key';
		const expectedTranslation = '[missing_translation](en)invalid_key';

		// Act:
		const translation = i18n.getCopy(key);

		// Assert:
		expect(translation).toBe(expectedTranslation);
	});
});
