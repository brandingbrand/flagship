/// <reference types="@brandingbrand/code-cli-kit/types" />

/**
 * Defines a plugin for @brandingbrand/code-cli-kit.
 * @module Plugin
 */

import {
  type BuildConfig,
  type PrebuildOptions,
  definePlugin,
} from '@brandingbrand/code-cli-kit';

/**
 * Defines a plugin with functions for both iOS and Android platforms.
 * @alias module:Plugin
 * @param {BuildConfig & CodePluginTargetExtension} build - The build configuration object.
 * @param {PrebuildOptions} options - The options object.
 */
export default definePlugin({
  /**
   * Function to be executed for iOS platform.
   * @param {BuildConfig & CodePluginTargetExtension} build - The build configuration object for iOS.
   * @param {PrebuildOptions} options - The options object for iOS.
   * @returns {Promise<void>} A promise that resolves when the process completes.
   */
  ios: async function (
    build: BuildConfig,
    options: PrebuildOptions,
  ): Promise<void> {},
  android: async function (
    build: BuildConfig,
    options: PrebuildOptions,
  ): Promise<void> {},
});
