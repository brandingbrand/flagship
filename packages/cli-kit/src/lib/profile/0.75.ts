/**
 * Imports the base profile configuration from version 0.73
 */
import {default as profile074} from './0.74';

/**
 * Default export containing dependency specifications and configurations
 * @exports {Object} Configuration object extending profile073
 */
export default {
  ...profile074,
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
};
