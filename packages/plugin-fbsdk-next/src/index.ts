/**
 * Defines a plugin for @brandingbrand/code-cli-kit.
 * @module Plugin
 */

import {
  type InfoPlist,
  definePlugin,
  path,
  string,
  withInfoPlist,
  withUTF8,
  withStrings,
  withManifest,
} from "@brandingbrand/code-cli-kit";
import { mergeAndConcat } from "merge-anything";

import type { CodePluginFBSDKNext } from "./types";

/**
 * Defines a plugin with functions for both iOS and Android platforms.
 * @alias module:Plugin
 * @param {BuildConfig} build - The build configuration object.
 * @param {PrebuildOptions} options - The options object.
 */
export default definePlugin<CodePluginFBSDKNext>({
  /**
   * Function to be executed for iOS platform.
   * @param {BuildConfig} build - The build configuration object for iOS.
   * @param {PrebuildOptions} options - The options object for iOS.
   * @returns {Promise<void>} A promise that resolves when the process completes.
   */
  ios: async function (build, options): Promise<void> {
    if (!build.codePluginFBSDKNext.plugin.ios) return;

    const {
      urlScheme,
      appId,
      clientToken,
      displayName,
      queriesSchemes = [],
    } = build.codePluginFBSDKNext.plugin.ios;

    await withInfoPlist((plist) => {
      return mergeAndConcat<InfoPlist, InfoPlist[]>(plist, {
        CFBundleURLTypes: [
          {
            CFBundleURLSchemes: [urlScheme],
          },
        ],
        FacebookAppID: appId,
        FacebookClientToken: clientToken,
        FacebookDisplayName: displayName,
        LSApplicationQueriesSchemes: queriesSchemes,
      });
    });

    await withUTF8(
      path.project.resolve("ios", "app", "AppDelegate.mm"),
      (content) => {
        return string.replace(
          content,
          /(#import "AppDelegate.h")/,
          `$1
  
#import <FBSDKCoreKit/FBSDKCoreKit-Swift.h>
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
  if ([[FBSDKApplicationDelegate sharedInstance] application:application openURL:url options:options]) {
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
  if ([[FBSDKApplicationDelegate sharedInstance] application:application openURL:url options:options]) {
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
   * @param {BuildConfig & CodePluginAsset} build - The build configuration object for Android.
   * @param {PrebuildOptions} options - The options object for Android.
   * @returns {Promise<void>} A promise that resolves when the process completes.
   */
  android: async function (build, options): Promise<void> {
    if (!build.codePluginFBSDKNext.plugin.android) return;

    const { appId, enableSharing, clientToken, advertisingIdOptOut } =
      build.codePluginFBSDKNext.plugin.android;

    await withStrings((xml) => {
      if (!xml.resources.string) {
        xml.resources = { ...xml.resources, string: [] };
      }

      xml.resources.string?.push(
        {
          $: { name: "facebook_app_id" },
          _: appId,
        },
        {
          $: { name: "facebook_client_token" },
          _: clientToken,
        }
      );
    });

    await withManifest((xml) => {
      const mainApplication = xml.manifest.application?.find(
        (it) => it.$["android:name"] === ".MainApplication"
      );

      if (!mainApplication) {
        throw new Error(
          "[CodePluginFBSDKNext]: cannot find '.MainApplication' in AndroidManifest.xml"
        );
      }

      if (!mainApplication["meta-data"]) {
        mainApplication["meta-data"] = [];
      }

      mainApplication["meta-data"].push(
        {
          $: {
            "android:name": "com.facebook.sdk.ApplicationId",
            "android:value": "@string/facebook_app_id",
          },
        },
        {
          $: {
            "android:name": "com.facebook.sdk.ClientToken",
            "android:value": "@string/facebook_client_token",
          },
        }
      );

      if (enableSharing) {
        if (!mainApplication.provider) {
          mainApplication.provider = [];
        }

        mainApplication.provider.push({
          $: {
            "android:authorities": `com.facebook.app.FacebookContentProvider${appId}`,
            "android:name": "com.facebook.FacebookContentProvider",
            "android:exported": true,
          },
        });
      }

      if (advertisingIdOptOut) {
        if (!xml.manifest["uses-permission"]) {
          xml.manifest["uses-permission"] = [];
        }

        xml.manifest["uses-permission"].push({
          $: {
            "android:name": "com.google.android.gms.permission.AD_ID",
            "tools:node": "remove",
          },
        });
      }
    });
  },
});

export type { CodePluginFBSDKNext };
