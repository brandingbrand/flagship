/**
 * Represents a profile of dependencies.
 * Each key is the name of a dependency and the value is an object containing
 * the version and type of the dependency.
 *
 * The "banned" type version doesn't matter - for purposes here just setting
 * to 1000.0.0 to make it obvious that it has no purpose.
 */
type Profile = Record<
  string,
  {
    version: string;
    type: 'dependency' | 'devDependency' | 'peerDependency' | 'banned';
    required?:
      | boolean
      | {
          sibling: {
            name: string;
            version: string;
            type: 'dependency' | 'devDependency' | 'peerDependency';
          };
        };
  }
>;

/**
 * Profile for React Native version 0.72.
 * Includes React and React Native dependencies with their respective versions and types.
 */
const react_native_0_72: Profile = {
  react: {
    version: '^18.2.0',
    type: 'dependency',
    required: true,
  },
  'react-native': {
    version: '^0.72.0',
    type: 'dependency',
    required: true,
  },
  'react-native-navigation': {
    version: '^7.37.2',
    type: 'dependency',
    required: {
      sibling: {
        name: '@brandingbrand/fsapp',
        version: '>=11.0.0 <13.0.0',
        type: 'dependency',
      },
    },
  },
  '@brandingbrand/react-native-app-restart': {
    version: '^0.4.0',
    type: 'dependency',
    required: {
      sibling: {
        name: '@brandingbrand/fsapp',
        version: '>=11.0.0 <13.0.0',
        type: 'dependency',
      },
    },
  },
  'react-native-device-info': {
    version: '>=10.7.0',
    type: 'dependency',
    required: {
      sibling: {
        name: '@brandingbrand/fsapp',
        version: '>=11.0.0 <13.0.0',
        type: 'dependency',
      },
    },
  },
  '@react-native-async-storage/async-storage': {
    version: '>=1.23.1',
    type: 'dependency',
    required: {
      sibling: {
        name: '@brandingbrand/fsapp',
        version: '>=11.0.0 <13.0.0',
        type: 'dependency',
      },
    },
  },
  'react-native-sensitive-info': {
    version: '^5.0.0',
    type: 'dependency',
    required: {
      sibling: {
        name: '@brandingbrand/fsapp',
        version: '>=11.0.0 <13.0.0',
        type: 'dependency',
      },
    },
  },
  '@babel/core': {
    version: '^7.20.0',
    type: 'devDependency',
    required: true,
  },
  '@babel/preset-env': {
    version: '^7.20.0',
    type: 'devDependency',
    required: true,
  },
  '@babel/runtime': {
    version: '^7.20.0',
    type: 'devDependency',
    required: true,
  },
  'metro-react-native-babel-preset': {
    version: '^0.76.9',
    type: 'devDependency',
    required: true,
  },
  '@types/react': {
    version: '^18.0.24',
    type: 'devDependency',
    required: true,
  },
  '@types/react-native': {
    version: '1000.0.0',
    type: 'banned',
  },
};

/**
 * Profile for React Native version 0.73.
 * Includes React and React Native dependencies with their respective versions and types.
 */
const react_native_0_73: Profile = {
  ...react_native_0_72,
  'react-native': {
    version: '^0.73.0',
    type: 'dependency',
    required: true,
  },
  'react-native-navigation': {
    version: '^7.37.2',
    type: 'dependency',
    required: {
      sibling: {
        name: '@brandingbrand/fsapp',
        version: '>=11.0.0 <13.0.0',
        type: 'dependency',
      },
    },
  },
  '@react-native/babel-preset': {
    version: '^0.73.21',
    type: 'devDependency',
    required: true,
  },
  'metro-react-native-babel-preset': {
    version: '1000.0.0',
    type: 'banned',
  },
};

/**
 * Exported profiles object containing different React Native version profiles.
 */
export const profiles = {
  '0.72': react_native_0_72,
  '0.73': react_native_0_73,
};
