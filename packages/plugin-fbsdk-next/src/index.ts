import {
  Config,
  fsk,
  infoPlist,
  manifest,
  path,
  summary,
  strings,
} from "@brandingbrand/code-core";

import type { CodePluginFBSDKNext } from "./types";

const ios = summary.withSummary(
  async (config: Config & CodePluginFBSDKNext) => {
    if (!config.codePluginFBSDKNext.plugin.ios) return;

    const { urlScheme, appId, clientToken, displayName, queriesSchemes } =
      config.codePluginFBSDKNext.plugin.ios;

    await infoPlist.setUrlScheme(urlScheme, config);

    await infoPlist.setPlist({ FacebookAppID: appId }, config);

    await infoPlist.setPlist({ FacebookClientToken: clientToken }, config);

    await infoPlist.setPlist({ FacebookDisplayName: displayName }, config);

    if (queriesSchemes) {
      await infoPlist.withInfoPlist((plist) => {
        if (plist.LSApplicationQueriesSchemes) {
          (plist.LSApplicationQueriesSchemes as string[]).push(
            ...queriesSchemes
          );
        } else {
          plist.LSApplicationQueriesSchemes = queriesSchemes;
        }

        return plist;
      }, config);
    }

    await fsk.update(
      path.ios.appDelegatePath(config),
      /(#import "AppDelegate.h")/,
      `$1
#import <FBSDKCoreKit/FBSDKCoreKit-Swift.h>`
    );

    await fsk.update(
      path.ios.appDelegatePath(config),
      /(if \(\[RCTLinkingManager[\s\S]+?})/,
      `$1
  if ([[FBSDKApplicationDelegate sharedInstance] application:application openURL:url options:options]) {
    return YES;
  }`
    );
  },
  "plugin-fbsdk-next",
  "platform::ios"
);

const android = summary.withSummary(
  async (config: CodePluginFBSDKNext) => {
    if (!config.codePluginFBSDKNext.plugin.android) return;

    const { appId, enableSharing, clientToken, advertisingIdOptOut } =
      config.codePluginFBSDKNext.plugin.android;

    await strings.addResourcesElements({
      string: [
        {
          $: {
            name: "facebook_app_id",
          },
          _: appId,
        },
        {
          $: {
            name: "facebook_client_token",
          },
          _: clientToken,
        },
      ],
    });

    await manifest.addApplicationEelements({
      "meta-data": [
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
        },
      ],
    });

    if (advertisingIdOptOut) {
      await manifest.addManifestElements({
        "uses-permission": [
          {
            $: {
              "android:name": "com.google.android.gms.permission.AD_ID",
              "tools:node": "remove",
            },
          },
        ],
      });
    }

    if (enableSharing) {
      await manifest.addApplicationEelements({
        provider: [
          {
            $: {
              "android:authorities": `com.facebook.app.FacebookContentProvider${appId}`,
              "android:name": "com.facebook.FacebookContentProvider",
              "android:exported": true,
            },
          },
        ],
      });
    }
  },
  "plugin-fbsdk-next",
  "platform::android"
);

export { ios, android };

export * from "./types";
