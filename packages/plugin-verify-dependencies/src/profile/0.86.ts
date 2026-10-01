import type {DependencyProfile} from '../types';

import {default as profile085} from './0.85';

export default {
  ...profile085,
  /**
   * React Native core package configuration
   * @property {string} version - The semantic version requirement
   * @property {string[]} capabilities - Required companion packages
   * @property {boolean} required - Indicates this is a required dependency
   * @see {@link https://reactnative.dev/}
   */
  'react-native': {
    version: '^0.86.0',
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
    version: '^0.86.0',
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
    version: '^0.86.0',
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
    version: '^0.86.0',
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
    version: '^0.86.0',
    capabilities: ['typescript'],
    devOnly: true,
  },
  /**
   * React core library configuration
   * @property {string} version - The semantic version requirement
   * @property {string[]} capabilities - Required type definitions
   * @property {boolean} required - Indicates this is a required dependency
   * @see {@link https://reactjs.org/}
   */
  react: {
    version: '19.2.3',
    capabilities: ['@types/react'],
    required: true,
  },
  /**
   * TypeScript definitions for React
   * @property {string} version - The semantic version requirement
   * @property {boolean} devOnly - Indicates this is a development-only dependency
   * @see {@link https://www.npmjs.com/package/@types/react}
   */
  '@types/react': {
    version: '^19.2.0',
    devOnly: true,
  },
  /**
   * React Native CLI Core package configuration
   * @property {string} version - The semantic version requirement
   * @property {boolean} devOnly - Indicates this is a development-only dependency
   * @see {@link https://github.com/react-native-community/cli#compatibility}
   */
  '@react-native-community/cli': {
    version: '20.1.0',
    devOnly: true,
  },
  /**
   * React Native CLI Android Platform package configuration
   * @property {string} version - The semantic version requirement
   * @property {boolean} devOnly - Indicates this is a development-only dependency
   * @see {@link https://github.com/react-native-community/cli#compatibility}
   */
  '@react-native-community/cli-platform-android': {
    version: '20.1.0',
    devOnly: true,
  },
  /**
   * React Native CLI iOS Platform package configuration
   * @property {string} version - The semantic version requirement
   * @property {boolean} devOnly - Indicates this is a development-only dependency
   * @see {@link https://github.com/react-native-community/cli#compatibility}
   */
  '@react-native-community/cli-platform-ios': {
    version: '20.1.0',
    devOnly: true,
  },
  /**
   * Babel compiler core
   * @property {string} version - The semantic version requirement
   * @property {boolean} devOnly - Indicates this is a development-only dependency
   */
  '@babel/core': {
    version: '^7.25.2',
    devOnly: true,
  },
  /**
   * Babel preset for compiling modern JavaScript
   * @property {string} version - The semantic version requirement
   * @property {boolean} devOnly - Indicates this is a development-only dependency
   */
  '@babel/preset-env': {
    version: '^7.25.3',
    devOnly: true,
  },
  /**
   * Babel runtime helpers
   * @property {string} version - The semantic version requirement
   * @property {boolean} devOnly - Indicates this is a development-only dependency
   */
  '@babel/runtime': {
    version: '^7.25.0',
    devOnly: true,
  },
} satisfies DependencyProfile;
