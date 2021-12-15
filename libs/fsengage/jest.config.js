module.exports = {
  displayName: 'fsengage',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  globals: {
    '__DEV__': true,
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  transform: {
    '\\.m?jsx?$': 'jest-esm-transformer',
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/fsengage',
  transformIgnorePatterns: [],
  moduleNameMapper: {
    '^react-native$': 'react-native-web',
  },
};
