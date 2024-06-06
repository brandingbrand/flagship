/**
 * Defines a plugin for @brandingbrand/code-cli-kit.
 * @module Plugin
 */

import {definePlugin} from '@brandingbrand/code-cli-kit';

/**
 * Defines a plugin with functions for both iOS and Android platforms.
 * @alias module:Plugin
 * @param {Object} build - The build configuration object.
 * @param {Object} options - The options object.
 */
export default definePlugin({
  /**
   * Function to be executed for iOS platform.
   * @param {Object} _build - The build configuration object for iOS.
   * @param {Object} _options - The options object for iOS.
   * @returns {Promise<void>} A promise that resolves when the process completes.
   */
  ios: async function (_build: object, _options: object): Promise<void> {},

  /**
   * Function to be executed for Android platform.
   * @param {Object} _build - The build configuration object for Android.
   * @param {Object} _options - The options object for Android.
   * @returns {Promise<void>} A promise that resolves when the process completes.
   */
  android: async function (_build: object, _options: object): Promise<void> {},
});
