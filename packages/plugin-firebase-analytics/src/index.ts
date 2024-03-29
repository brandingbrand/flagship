/**
 * Defines a plugin for @brandingbrand/code-cli-kit.
 * @module Plugin
 */

import {
  definePlugin,
  path,
  withUTF8,
  string,
} from "@brandingbrand/code-cli-kit";

import type { CodePluginFirebaseAnalytics } from "./types";

/**
 * Defines a plugin with functions for both iOS and Android platforms.
 * @alias module:Plugin
 * @param {BuildConfig & CodePluginFirebaseAnalytics} build - The build configuration object.
 * @param {PrebuildOptions} options - The options object.
 */
export default definePlugin<CodePluginFirebaseAnalytics>({
  /**
   * Function to be executed for iOS platform.
   * @param {BuildConfig & CodePluginFirebaseAnalytics} build - The build configuration object for iOS.
   * @param {PrebuildOptions} options - The options object for iOS.
   * @returns {Promise<void>} A promise that resolves when the process completes.
   */
  ios: async function (build, _options): Promise<void> {
    if (!build.codePluginFirebaseAnalytics.plugin.ios?.disableAdId) {
      return;
    }

    await withUTF8(path.ios.podfile, (content) => {
      return string.replace(
        content,
        /(platform :[\s\S]+?\n)/,
        `$1
$RNFirebaseAnalyticsWithoutAdIdSupport = true\n`
      );
    });
  },
});

export type { CodePluginFirebaseAnalytics };
