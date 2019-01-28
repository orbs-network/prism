module.exports = {
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testRegex: '^.+\\.test\\.ts$',
  moduleFileExtensions: ['ts', 'js', 'json'],
  setupTestFrameworkScriptFile: '<rootDir>/jestSetup.ts',
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.json',
    },
  },
  preset: 'jest-puppeteer',
};
