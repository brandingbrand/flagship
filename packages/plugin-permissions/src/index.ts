/**
 * Defines a plugin for @brandingbrand/code-cli-kit.
 * @module Plugin
 */

import {
  type BuildConfig,
  type PrebuildOptions,
  definePlugin,
  withUTF8,
  string,
  withInfoPlist,
  withManifest,
} from "@brandingbrand/code-cli-kit";

import * as permissions from "./permissions";
import { CodePluginPermissions } from "./types";

/**
 * Defines a plugin with functions for both iOS and Android platforms.
 * @alias module:Plugin
 * @param {BuildConfig & CodePluginPermissions} build - The build configuration object.
 * @param {PrebuildOptions} options - The options object.
 */
export default definePlugin<CodePluginPermissions>({
  /**
   * Function to be executed for iOS platform.
   * @param {BuildConfig & CodePluginPermissions} build - The build configuration object for iOS.
   * @param {PrebuildOptions} options - The options object for iOS.
   * @returns {Promise<void>} A promise that resolves when the process completes.
   */
  ios: async function (
    build: BuildConfig & CodePluginPermissions,
    options: PrebuildOptions
  ): Promise<void> {
    // Check if the iOS plugin permissions are defined
    if (!build.codePluginPermissions.plugin.ios) return;

    // Resolve the path for RNPermissions.podspec file
    const filePath = require.resolve(
      "react-native-permissions/RNPermissions.podspec"
    );

    // Update podspec file with appropriate permissions
    await withUTF8(filePath, (content) => {
      const pods = build.codePluginPermissions.plugin.ios!.reduce(
        (acc, curr) => {
          const pod = permissions.ios[curr.permission];

          if (!pod?.pod) return acc;

          return `${acc}, "ios/${pod?.pod}/*.{h,m,mm}"`;
        },
        "ios/*.{h,m,mm}"
      );

      const transformedContent = string.replace(
        content,
        /(source_files\s+=\s+).*/,
        `$1${pods}`
      );

      return transformedContent;
    });

    // Update Info.plist with appropriate permissions and texts
    await withInfoPlist((plist) => {
      const newPlist = build.codePluginPermissions.plugin
        .ios!.filter((it) => it.text)
        .reduce((acc, curr) => {
          const pod = permissions.ios[curr.permission];

          if (!pod?.usageKey) return acc;

          if (!curr.text) {
            `[CodePermissionsPluginError]: ${pod.pod} permission requires a 'usageKey'.`;
          }

          // Exception case for LocationAccuracy permission which requires a purpose key
          // https://developer.apple.com/documentation/bundleresources/information_property_list/nslocationtemporaryusagedescriptiondictionary
          if (curr.permission === "LocationAccuracy") {
            if (!curr.purposeKey) {
              throw Error(
                "[CodePermissionsPluginError]: 'LocationAccuracy' permission requires a 'purposekey'."
              );
            }
            return {
              ...acc,
              [pod.usageKey]: {
                [curr.purposeKey]: curr.text,
              },
            };
          }

          return {
            ...acc,
            [pod.usageKey]: curr.text,
          };
        }, plist);

      return newPlist;
    });
  },

  /**
   * Function to be executed for Android platform.
   * @param {BuildConfig & CodePluginPermissions} build - The build configuration object for Android.
   * @param {PrebuildOptions} options - The options object for Android.
   * @returns {Promise<void>} A promise that resolves when the process completes.
   */
  android: async function (
    build: BuildConfig & CodePluginPermissions,
    options: PrebuildOptions
  ): Promise<void> {
    // Check if the Android plugin permissions are defined
    if (!build.codePluginPermissions.plugin.android) return;

    // Update AndroidManifest.xml with appropriate permissions
    await withManifest((xml) => {
      if (!xml.manifest["uses-permission"]) {
        xml.manifest = { ...xml.manifest, "uses-permission": [] };
      }

      build.codePluginPermissions.plugin.android?.forEach((it) => {
        xml.manifest["uses-permission"]?.push({
          $: {
            "android:name": `android.permission.${it}`,
          },
        });
      });
    });
  },
});
