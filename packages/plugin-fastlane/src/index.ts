/**
 * Defines a plugin for @brandingbrand/code-cli-kit.
 * @module Plugin
 */

import {
  type BuildConfig,
  type PrebuildOptions,
  definePlugin,
  path,
} from "@brandingbrand/code-cli-kit";

import type { CodePluginFastlane } from "./types";

/**
 * Defines a plugin with functions for both iOS and Android platforms.
 * @alias module:Plugin
 * @param {BuildConfig & CodePluginFastlane} build - The build configuration object.
 * @param {PrebuildOptions} options - The options object.
 */
export default definePlugin<CodePluginFastlane>({
  /**
   * Function to be executed for iOS platform.
   * @param {BuildConfig & CodePluginTargetExtension} build - The build configuration object for iOS.
   * @param {PrebuildOptions} options - The options object for iOS.
   * @returns {Promise<void>} A promise that resolves when the process completes.
   */
  ios: async function (
    build: BuildConfig & CodePluginFastlane,
    options: PrebuildOptions
  ): Promise<void> {},

  /**
   * Function to be executed for Android platform.
   * @param {BuildConfig & CodePluginTargetExtension} build - The build configuration object for Android.
   * @param {PrebuildOptions} options - The options object for Android.
   * @returns {Promise<void>} A promise that resolves when the process completes.
   */
  android: async function (
    build: BuildConfig & CodePluginFastlane,
    options: PrebuildOptions
  ): Promise<void> {},
});

export type { CodePluginFastlane };
