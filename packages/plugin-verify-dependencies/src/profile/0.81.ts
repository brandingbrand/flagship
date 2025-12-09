import type {DependencyProfile} from '../types';

import {default as profile080} from './0.80';

export default {
  ...profile080,
  /**
   * React Native core package configuration
   * @property {string} version - The semantic version requirement
   * @property {string[]} capabilities - Required companion packages
   * @property {boolean} required - Indicates this is a required dependency
   * @see {@link https://reactnative.dev/}
   */
  'react-native': {
    version: '^0.81.0',
    capabilities: [
      'react',
      '@react-native/babel-preset',
      '@react-native/metro-config',
    ],
    required: true,
  },
  /**
   * React Native Babel preset configuration
   * @property {string} version - The semantic version requirement
   * @property {string[]} capabilities - Required Babel dependencies
   * @property {boolean} devOnly - Indicates this is a development-only dependency
   * @see {@link https://github.com/facebook/react-native/tree/main/packages/babel-preset-react-native}
   */
  '@react-native/babel-preset': {
    version: '^0.81.0',
    capabilities: ['@babel/core', '@babel/preset-env', '@babel/runtime'],
    devOnly: true,
  },
  /**
   * React Native Metro bundler configuration
   * @property {string} version - The semantic version requirement
   * @property {boolean} devOnly - Indicates this is a development-only dependency
   * @see {@link https://facebook.github.io/metro/}
   */
  '@react-native/metro-config': {
    version: '^0.81.0',
    devOnly: true,
  },
  /**
   * React Native ESLint configuration
   * @property {string} version - The semantic version requirement
   * @property {string[]} capabilities - Required ESLint dependencies
   * @property {boolean} devOnly - Indicates this is a development-only dependency
   * @see {@link https://github.com/facebook/react-native/tree/main/packages/eslint-config-react-native}
   */
  '@react-native/eslint-config': {
    version: '^0.81.0',
    capabilities: ['eslint', 'prettier'],
    devOnly: true,
  },
  /**
   * Typescript base configuration for React Native
   * @property {string} version - The semantic version requirement
   * @property {string[]} capabilities - Required type definitions
   * @property {boolean} devOnly - Indicates this is a development-only dependency
   * @see {@link https://github.com/facebook/react-native/tree/main/packages/typescript-config}
   */
  '@react-native/typescript-config': {
    version: '^0.81.0',
    capabilities: ['typescript'],
    devOnly: true,
  },
  /**
   * React Native CLI Core package configuration
   * @property {string} version - The semantic version requirement
   * @property {boolean} devOnly - Indicates this is a development-only dependency
   * @see {@link https://github.com/react-native-community/cli#compatibility}
   */
  '@react-native-community/cli': {
    version: '^20.0.0',
    devOnly: true,
  },
  /**
   * React Native CLI Android Platform package configuration
   * @property {string} version - The semantic version requirement
   * @property {boolean} devOnly - Indicates this is a development-only dependency
   * @see {@link https://github.com/react-native-community/cli#compatibility}
   */
  '@react-native-community/cli-platform-android': {
    version: '^20.0.0',
    devOnly: true,
  },
  /**
   * React Native CLI iOS Platform package configuration
   * @property {string} version - The semantic version requirement
   * @property {boolean} devOnly - Indicates this is a development-only dependency
   * @see {@link https://github.com/react-native-community/cli#compatibility}
   */
  '@react-native-community/cli-platform-ios': {
    version: '^20.0.0',
    devOnly: true,
  },
} satisfies Record<string, DependencyProfile>;
