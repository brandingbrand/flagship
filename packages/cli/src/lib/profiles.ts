/**
 * Represents a profile of dependencies.
 * Each key is the name of a dependency and the value is an object containing
 * the version and type of the dependency.
 *
 * The "banned" type version doesn't matter - for purposes here just setting
 * to 1000.0.0 to make it obvious that it has no purpose.
 */

export type Profile = {
  version: string;
  devOnly?: boolean;
  capabilities?: string[];
  required?: boolean;
  banned?: boolean;
};

/**
 * Profile for React Native version 0.72.
 * Includes React and React Native dependencies with their respective versions and types.
 */
const react_native_0_72: Record<string, Profile> = {
  react: {
    version: '18.2.0',
    capabilities: ['@types/react'],
    required: true,
  },
  'react-native': {
    version: '^0.72.0',
    capabilities: [
      'react',
      'metro-react-native-babel-preset',
      '@react-native/metro-config',
    ],
    required: true,
  },
  'metro-react-native-babel-preset': {
    version: '^0.76.9',
    capabilities: ['@babel/core', '@babel/preset-env', '@babel/runtime'],
    devOnly: true,
  },
  '@babel/core': {
    version: '^7.20.0',
    devOnly: true,
  },
  '@babel/preset-env': {
    version: '^7.20.0',
    devOnly: true,
  },
  '@babel/runtime': {
    version: '^7.20.0',
    devOnly: true,
  },
  '@react-native/metro-config': {
    version: '^0.72.0',
    devOnly: true,
  },
  '@types/react': {
    version: '^18.2.0',
    devOnly: true,
  },
  '@types/react-native': {
    version: '1000.0.0',
    devOnly: true,
    banned: true,
  },
  '@brandingbrand/fsapp': {
    version: '>=10 <=13',
    capabilities: [
      'react-native-navigation',
      '@brandingbrand/react-native-app-restart',
      'react-native-device-info',
      '@react-native-async-storage/async-storage',
      'react-native-sensitive-info',
    ],
  },
  'react-native-navigation': {
    version: '^7.37.2',
  },
  '@brandingbrand/react-native-app-restart': {
    version: '^0.4.0',
  },
  'react-native-device-info': {
    version: '>=10.7.0',
  },
  '@react-native-async-storage/async-storage': {
    version: '>=1.23.1',
  },
  'react-native-sensitive-info': {
    version: '^5.0.0',
  },
};

/**
 * Profile for React Native version 0.73.
 * Includes React and React Native dependencies with their respective versions and types.
 */
const react_native_0_73: Record<string, Profile> = {
  ...react_native_0_72,
  'react-native': {
    version: '^0.73.0',
    capabilities: [
      'react',
      '@react-native/babel-preset',
      '@react-native/metro-config',
    ],
    required: true,
  },
  'react-native-navigation': {
    version: '^7.40.1',
  },
  '@react-native/babel-preset': {
    version: '^0.73.21',
    capabilities: ['@babel/core', '@babel/preset-env', '@babel/runtime'],
    devOnly: true,
  },
  '@react-native/metro-config': {
    version: '^0.73.0',
    devOnly: true,
  },
  'metro-react-native-babel-preset': {
    version: '1000.0.0',
    devOnly: true,
    banned: true,
  },
};

/**
 * Exported profiles object containing different React Native version profiles.
 */
export const profiles = {
  '0.72': react_native_0_72,
  '0.73': react_native_0_73,
};
