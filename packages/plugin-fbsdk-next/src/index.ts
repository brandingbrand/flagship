import { Config, fsk, path } from "@brandingbrand/kernel-core";

import type { KernelPluginFBSDKNext } from "./types";

const ios = async (config: Config & KernelPluginFBSDKNext) => {
  if (!config.kernelPluginFBSDKNext.kernel.ios) return;

  if (
    await fsk.doesKeywordExist(
      path.ios.infoPlistPath(config),
      "CFBundleURLTypes"
    )
  ) {
    await fsk.update(
      path.ios.infoPlistPath(config),
      /(CFBundleURLSchemes[\s\S]+?<array>)/,
      `$1
            <string>${config.kernelPluginFBSDKNext.kernel.ios?.urlScheme}</string>`
    );
  } else {
    await fsk.update(
      path.ios.infoPlistPath(config),
      /(<plist[\s\S]+?<dict>)/,
      `$1
    <key>CFBundleURLTypes</key>
    <array>
      <dict>
        <key>CFBundleTypeRole</key>
        <string>Editor</string>
        <key>CFBundleURLSchemes</key>
        <array>
          <string>${config.kernelPluginFBSDKNext.kernel.ios?.urlScheme}</string>
        </array>
      </dict>
    </array>`
    );
  }

  await fsk.update(
    path.ios.infoPlistPath(config),
    /(<plist[\s\S]+?<dict>)/,
    `$1
    <key>FacebookAppID</key>
    <string>${config.kernelPluginFBSDKNext.kernel.ios?.appId}</string>
    <key>FacebookClientToken</key>
    <string>${config.kernelPluginFBSDKNext.kernel.ios?.clientToken}</string>
    <key>FacebookDisplayName</key>
    <string>${config.kernelPluginFBSDKNext.kernel.ios?.displayName}</string>`
  );

  if (config.kernelPluginFBSDKNext.kernel.ios?.queriesSchemes) {
    if (
      await fsk.doesKeywordExist(
        path.ios.infoPlistPath(config),
        "LSApplicationQueriesSchemes"
      )
    ) {
      await fsk.update(
        path.ios.infoPlistPath(config),
        /(LSApplicationQueriesSchemes[\s\S]+?<array>)/,
        `$1
        ${config.kernelPluginFBSDKNext.kernel.ios.queriesSchemes
          .map((it) => {
            return `        <string>${it}</string>`;
          })
          .join("\n")}`
      );
    } else {
      await fsk.update(
        path.ios.infoPlistPath(config),
        /(<plist[\s\S]+?<dict>)/,
        `$1
    <key>LSApplicationQueriesSchemes</key>
    <array>
    ${config.kernelPluginFBSDKNext.kernel.ios.queriesSchemes
      .map((it) => {
        return `  <string>${it}</string>`;
      })
      .join("\n    ")}
    </array>`
      );
    }
  }

  await fsk.update(
    path.ios.appDelegatePath(config),
    /(#import "AppDelegate.h")/,
    `$1
#import <FBSDKCoreKit/FBSDKCoreKit-swift.h>`
  );

  await fsk.update(
    path.ios.appDelegatePath(config),
    /(if \(\[RCTLinkingManager[\s\S]+?})/,
    `$1
  if ([[FBSDKApplicationDelegate sharedInstance] application:app openURL:url options:options]) {
    return YES;
  }`
  );
};

const android = async (config: KernelPluginFBSDKNext) => {
  if (!config.kernelPluginFBSDKNext.kernel.android) return;

  const { appId, enableSharing, clientToken, advertisingIdOptOut } =
    config.kernelPluginFBSDKNext.kernel.android;

  await fsk.update(
    path.android.stringsPath(),
    /(<resources>)/,
    `$1
    <string name="facebook_app_id">${appId}</string>
    <string name="facebook_client_token">${clientToken}</string>`
  );

  await fsk.update(
    path.android.manifestPath(),
    /(<application[\s\S]+?>)/,
    `$1
      <meta-data android:name="com.facebook.sdk.ApplicationId" android:value="@string/facebook_app_id"/>
      <meta-data android:name="com.facebook.sdk.ClientToken" android:value="@string/facebook_client_token"/>`
  );

  if (
    !(await fsk.doesKeywordExist(
      path.android.manifestPath(),
      'uses-permission android:name="android.permission.INTERNET"'
    ))
  ) {
    await fsk.update(
      path.android.manifestPath(),
      /(<manifest[\s\S]+?>)/,
      `$1
    <uses-permission android:name="android.permission.INTERNET" />`
    );
  }

  if (advertisingIdOptOut) {
    await fsk.update(
      path.android.manifestPath(),
      /(<manifest[\s\S]+?>)/,
      `$1
    <uses-permission android:name="com.google.android.gms.permission.AD_ID" tools:node="remove"/>`
    );
  }

  if (enableSharing) {
    await fsk.update(
      path.android.manifestPath(),
      /(<application[\s\S]+?>)/,
      `$1
      <provider android:authorities="com.facebook.app.FacebookContentProvider${appId}" android:name="com.facebook.FacebookContentProvider" android:exported="true" />`
    );
  }
};

export { ios, android };
