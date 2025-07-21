/**
 * Profile configuration for React Native 0.73.x and related dependencies
 * @module ProfileConfig073
 */

import type {DependencyProfile} from '../types';

import {default as profile072} from './0.72';

/**
 * Default export containing dependency configurations
 * Extends profile from React Native 0.72.x with updated versions and capabilities
 */
export default {
  ...profile072,
  /**
   * Core React Native package configuration
   * @property {string} version - Target version ^0.73.0
   * @property {string[]} capabilities - Required capabilities (react, babel-preset, metro-config)
   * @property {boolean} required - Indicates this is a required dependency
   */
  'react-native': {
    version: '^0.73.0',
    capabilities: [
      'react',
      '@react-native/babel-preset',
      '@react-native/metro-config',
    ],
    required: true,
  },
  /**
   * React Native Navigation package configuration
   * @property {string} version - Target version ^7.40.1
   */
  'react-native-navigation': {
    version: '^7.40.1',
  },
  /**
   * React Native Babel preset configuration
   * @property {string} version - Target version ^0.73.21
   * @property {string[]} capabilities - Required Babel dependencies
   * @property {boolean} devOnly - Development-only dependency
   */
  '@react-native/babel-preset': {
    version: '^0.73.21',
    capabilities: ['@babel/core', '@babel/preset-env', '@babel/runtime'],
    devOnly: true,
  },
  /**
   * React Native Metro bundler configuration
   * @property {string} version - Target version ^0.73.0
   * @property {boolean} devOnly - Development-only dependency
   */
  '@react-native/metro-config': {
    version: '^0.73.0',
    devOnly: true,
  },
  /**
   * React Native ESLint configuration
   * @property {string} version - Target version ^0.73.0
   * @property {string[]} capabilities - Required ESLint dependencies
   * @property {boolean} devOnly - Development-only dependency
   */
  '@react-native/eslint-config': {
    version: '^0.73.0',
    capabilities: ['eslint', 'prettier'],
    devOnly: true,
  },
  /**
   * Typescript base configuration for React Native
   * @property {string} version - Target version ^0.73.0
   * @property {string[]} capabilities - Required typescript dependencies
   * @property {boolean} devOnly - Development-only dependency
   */
  '@react-native/typescript-config': {
    version: '^0.73.0',
    capabilities: ['typescript'],
    devOnly: true,
  },
  /**
   * Legacy Metro React Native Babel preset
   * @property {string} version - Artificially high version to prevent usage
   * @property {boolean} devOnly - Development-only dependency
   * @property {boolean} banned - Indicates this package should not be used
   */
  'metro-react-native-babel-preset': {
    version: '1000.0.0',
    devOnly: true,
    banned: true,
  },
  /**
   * Legacy react-native typescript configuration preset.
   * @property {string} version - Artificially high version to prevent usage
   * @property {boolean} devOnly - Development-only dependency
   * @property {boolean} banned - Indicates this package should not be used
   */
  '@tsconfig/react-native': {
    version: '1000.0.0',
    devOnly: true,
    banned: true,
  },
} satisfies Record<string, DependencyProfile>;
