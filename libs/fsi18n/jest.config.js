module.exports = {
  displayName: 'fsi18n',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json'
    },
  },
  transform: {
    "\\.m?jsx?$": "jest-esm-transformer",
    '^.+\\.[tj]sx?$': 'ts-jest'
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/fsi18n',
  transformIgnorePatterns: [],
};