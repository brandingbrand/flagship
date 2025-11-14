import type {DependencyProfile} from '../types';

import {default as profile077} from './0.77';

/**
 * Default export containing dependency specifications and configurations
 * @exports {Object} Configuration object extending profile077
 * @see profile077
 */
export default {
  ...profile077,
  /**
   * React Native core package configuration
   * @property {string} version - The semantic version requirement
   * @property {string[]} capabilities - Required companion packages
   * @property {boolean} required - Indicates this is a required dependency
   * @see {@link https://reactnative.dev/}
   */
  'react-native': {
    version: '^0.78.0',
    capabilities: [
      'react',
      '@react-native/babel-preset',
      '@react-native/metro-config',
    ],
    required: true,
  },
  /**
   * React Native Navigation package configuration
   * @property {string} version - Target version ^8.4.0
   */
  'react-native-navigation': {
    version: '^8.4.0',
  },
  /**
   * React Native Babel preset configuration
   * @property {string} version - The semantic version requirement
   * @property {string[]} capabilities - Required Babel dependencies
   * @property {boolean} devOnly - Indicates this is a development-only dependency
   * @see {@link https://github.com/facebook/react-native/tree/main/packages/babel-preset-react-native}
   */
  '@react-native/babel-preset': {
    version: '^0.78.0',
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
    version: '^0.78.0',
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
    version: '19.0.0',
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
    version: '^19.0.0',
    devOnly: true,
  },
} satisfies Record<string, DependencyProfile>;
