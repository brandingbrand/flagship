/**
 * Defines a plugin for @brandingbrand/code-cli-kit.
 * @module Plugin
 */

import {
  definePlugin,
  path,
  string,
  withInfoPlist,
  withUTF8,
} from "@brandingbrand/code-cli-kit";
import { mergeAndConcat } from "merge-anything";

import type { CodePluginGoogleSignin } from "./types";

/**
 * Defines a plugin with functions for both iOS and Android platforms.
 * @alias module:Plugin
 * @param {BuildConfig & CodePluginGoogleSignin} build - The build configuration object.
 * @param {PrebuildOptions} options - The options object.
 */
export default definePlugin<CodePluginGoogleSignin>({
  /**
   * Function to be executed for iOS platform.
   * @param {BuildConfig & CodePluginGoogleSignin} build - The build configuration object for iOS.
   * @param {PrebuildOptions} options - The options object for iOS.
   * @returns {Promise<void>} A promise that resolves when the process completes.
   */
  ios: async function (build, options): Promise<void> {
    if (build.codePluginGoogleSignin.plugin.ios.reversedClientId) {
      await withInfoPlist((plist) => {
        return mergeAndConcat(plist, {
          CFBundleURLTypes: [
            {
              CFBundleURLSchemes: [
                build.codePluginGoogleSignin.plugin.ios.reversedClientId,
              ],
            },
          ],
        });
      });
    }

    await withUTF8(
      path.project.resolve("ios", "app", "AppDelegate.mm"),
      (content) => {
        return string.replace(
          content,
          /(#import "AppDelegate.h")/,
          `$1
  
#import <RNGoogleSignin/RNGoogleSignin.h>
  `
        );
      }
    );

    await withUTF8(
      path.project.resolve("ios", "app", "AppDelegate.mm"),
      (content) => {
        if (content.match(/RCTLinkingManager/gm)) {
          return string.replace(
            content,
            /(if \(\[RCTLinkingManager[\s\S]+?})/,
            `$1
  if ([RNGoogleSignin application:application openURL:url options:options]) {
    return YES;
  }`
          );
        }

        return string.replace(
          content,
          /(@end)/,
          `- (BOOL)application:(UIApplication *)application
openURL:(NSURL *)url
options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  if ([RNGoogleSignin application:application openURL:url options:options]) {
    return YES;
  }

  return NO;
}
$1`
        );
      }
    );
  },

  /**
   * Function to be executed for Android platform.
   * @param {BuildConfig & CodePluginGoogleSignin} build - The build configuration object for Android.
   * @param {PrebuildOptions} options - The options object for Android.
   * @returns {Promise<void>} A promise that resolves when the process completes.
   */
  android: async function (build, options): Promise<void> {
    await withUTF8(path.android.buildGradle, (content) => {
      return string.replace(
        content,
        /(ext {)/,
        `$1
        googlePlayServicesAuthVersion = "${
          build.codePluginGoogleSignin.plugin.android
            .googlePlayServicesAuthVersion || "19.2.0"
        }"`
      );
    });

    await withUTF8(path.android.appBuildGradle, (content) => {
      return string.replace(
        content,
        /(dependencies {)/,
        `$1
    implementation 'androidx.swiperefreshlayout:swiperefreshlayout:${
      build.codePluginGoogleSignin.plugin.android.swiperefreshlayoutVersion ||
      "1.0.0"
    }'`
      );
    });
  },
});

export type { CodePluginGoogleSignin };
