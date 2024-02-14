/**
 * Defines a plugin for @brandingbrand/code-cli-kit.
 * @module Plugin
 */

import {
  type BuildConfig,
  type PrebuildOptions,
  definePlugin,
  fs,
  path,
} from "@brandingbrand/code-cli-kit";
import linkAssets from "react-native-asset";

import type { CodePluginAsset } from "./types";

/**
 * Defines a plugin with functions for both iOS and Android platforms.
 * @alias module:Plugin
 * @param {BuildConfig & CodePluginAsset} build - The build configuration object.
 * @param {PrebuildOptions} options - The options object.
 */
export default definePlugin<CodePluginAsset>({
  /**
   * Function to be executed for iOS platform.
   * @param {BuildConfig & CodePluginAsset} build - The build configuration object for iOS.
   * @param {PrebuildOptions} options - The options object for iOS.
   * @returns {Promise<void>} A promise that resolves when the process completes.
   */
  ios: async function (
    build: BuildConfig & CodePluginAsset,
    options: PrebuildOptions
  ): Promise<void> {
    const { assetPath } = build.codePluginAsset.plugin;

    linkAssets({
      rootPath: path.project.resolve(),
      shouldUnlink: true,
      platforms: {
        ios: {
          enabled: true,
          assets: assetPath.map((it) => path.project.resolve(it)),
        },
        android: {
          enabled: false,
          assets: assetPath.map((it) => path.project.resolve(it)),
        },
      },
    });
  },

  /**
   * Function to be executed for Android platform.
   * @param {BuildConfig & CodePluginAsset} build - The build configuration object for Android.
   * @param {PrebuildOptions} options - The options object for Android.
   * @returns {Promise<void>} A promise that resolves when the process completes.
   */
  android: async function (
    build: BuildConfig & CodePluginAsset,
    options: PrebuildOptions
  ): Promise<void> {
    const { assetPath } = build.codePluginAsset.plugin;

    linkAssets({
      rootPath: path.project.resolve(),
      shouldUnlink: true,
      platforms: {
        ios: {
          enabled: false,
          assets: assetPath.map((it) => path.project.resolve(it)),
        },
        android: {
          enabled: true,
          assets: assetPath.map((it) => path.project.resolve(it)),
        },
      },
    });
  },
});

export type { CodePluginAsset };
