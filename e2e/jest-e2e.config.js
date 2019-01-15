module.exports = {
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testRegex: '^.+\\.test\\.ts$',
  moduleFileExtensions: ['ts', 'js', 'json'],
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.json',
    },
  },
  preset: 'jest-puppeteer',
};
