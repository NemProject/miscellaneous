module.exports = {
	collectCoverage: true,
	collectCoverageFrom: ['src/**/*.{js,jsx}'],
	testMatch: [
		'**/__tests__/**/*(spec|test).[jt]s?(x)',
		'**/?(*.)+(spec|test).[jt]s?(x)'
	]
};
