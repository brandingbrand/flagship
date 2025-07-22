import type {DependencyProfile} from '../types';

import {default as profile073} from './0.73';

/**
 * Default export containing dependency specifications and configurations
 * @exports {Object} Configuration object extending profile073
 */
export default {
  ...profile073,
  /**
   * React Native core package configuration
   * @property {string} version - The semantic version requirement
   * @property {string[]} capabilities - Required companion packages
   * @property {boolean} required - Indicates this is a required dependency
   */
  'react-native': {
    version: '^0.74.0',
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
    version: '^0.74.87',
    capabilities: ['@babel/core', '@babel/preset-env', '@babel/runtime'],
    devOnly: true,
  },
  /**
   * React Native Metro bundler configuration
   * @property {string} version - The semantic version requirement
   * @property {boolean} devOnly - Indicates this is a development-only dependency
   */
  '@react-native/metro-config': {
    version: '^0.74.87',
    devOnly: true,
  },
  /**
   * React Native ESLint configuration
   * @property {string} version - The semantic version requirement
   * @property {string[]} capabilities - Required ESLint dependencies
   * @property {boolean} devOnly - Indicates this is a development-only dependency
   */
  '@react-native/eslint-config': {
    version: '^0.74.87',
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
    version: '^0.74.87',
    capabilities: ['typescript'],
    devOnly: true,
  },
  /**
   * React Native CLI Core package configuration
   * @property {string} version - The semantic version requirement
   * @property {boolean} devOnly - Indicates this is a development-only dependency
   */
  '@react-native-community/cli': {
    version: '^13.0.0',
    devOnly: true,
  },
  /**
   * React Native CLI Android Platform package configuration
   * @property {string} version - The semantic version requirement
   * @property {boolean} devOnly - Indicates this is a development-only dependency
   */
  '@react-native-community/cli-platform-android': {
    version: '^13.0.0',
    devOnly: true,
  },
  /**
   * React Native CLI iOS Platform package configuration
   * @property {string} version - The semantic version requirement
   * @property {boolean} devOnly - Indicates this is a development-only dependency
   */
  '@react-native-community/cli-platform-ios': {
    version: '^13.0.0',
    devOnly: true,
  },
} satisfies Record<string, DependencyProfile>;
