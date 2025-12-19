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
   * React Native App Restart configuration
   * @property {string} version - The semantic version requirement
   * @property {string} updateVersion - Indicates the version to install if dependency is out of range
   */
  '@brandingbrand/react-native-app-restart': {
    version: '^0.4.0 || ^0.5.0',
    updateVersion: '^0.4.0',
  },
} satisfies DependencyProfile;
