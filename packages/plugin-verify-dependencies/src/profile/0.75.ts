import type {DependencyProfile} from '../types';

import {default as profile074} from './0.74';

/**
 * Default export containing dependency specifications and configurations
 * @exports {Object} Configuration object extending profile074
 */
export default {
  ...profile074,
  /**
   * React core library configuration
   * @property {string} version - The semantic version requirement
   * @property {string[]} capabilities - Required type definitions
   * @property {boolean} required - Indicates this is a required dependency
   * @see {@link https://reactjs.org/}
   */
  react: {
    version: '18.3.1',
    capabilities: ['@types/react'],
    required: true,
  },
  /**
   * React Native core package configuration
   * @property {string} version - The semantic version requirement
   * @property {string[]} capabilities - Required companion packages
   * @property {boolean} required - Indicates this is a required dependency
   */
  'react-native': {
    version: '^0.75.0',
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
   */
  '@react-native/babel-preset': {
    version: '^0.75.0',
    capabilities: ['@babel/core', '@babel/preset-env', '@babel/runtime'],
    devOnly: true,
  },
  /**
   * React Native Metro bundler configuration
   * @property {string} version - The semantic version requirement
   * @property {boolean} devOnly - Indicates this is a development-only dependency
   */
  '@react-native/metro-config': {
    version: '^0.75.0',
    devOnly: true,
  },
  /**
   * React Native ESLint configuration
   * @property {string} version - The semantic version requirement
   * @property {string[]} capabilities - Required ESLint dependencies
   * @property {boolean} devOnly - Indicates this is a development-only dependency
   */
  '@react-native/eslint-config': {
    version: '^0.75.0',
    capabilities: ['eslint', 'prettier'],
    devOnly: true,
  },
  /**
   * Typescript base configuration for React Native
   * @property {string} version - The semantic version requirement
   * @property {string[]} capabilities - Required typescript dependencies
   * @property {boolean} devOnly - Indicates this is a development-only dependency
   */
  '@react-native/typescript-config': {
    version: '^0.75.0',
    capabilities: ['typescript'],
    devOnly: true,
  },
  /**
   * React Native CLI Core package configuration
   * @property {string} version - The semantic version requirement
   * @property {boolean} devOnly - Indicates this is a development-only dependency
   */
  '@react-native-community/cli': {
    version: '^14.0.0',
    devOnly: true,
  },
  /**
   * React Native CLI Android Platform package configuration
   * @property {string} version - The semantic version requirement
   * @property {boolean} devOnly - Indicates this is a development-only dependency
   */
  '@react-native-community/cli-platform-android': {
    version: '^14.0.0',
    devOnly: true,
  },
  /**
   * React Native CLI iOS Platform package configuration
   * @property {string} version - The semantic version requirement
   * @property {boolean} devOnly - Indicates this is a development-only dependency
   */
  '@react-native-community/cli-platform-ios': {
    version: '^14.0.0',
    devOnly: true,
  },
  '@types/react': {
    version: '^18.2.6',
    devOnly: true,
  },
} satisfies Record<string, DependencyProfile>;
