/* eslint-disable no-useless-escape */

import { Config, fsk, path, summary } from "@brandingbrand/code-core";

import type { CodePluginLeanplum } from "./types";

const ios = summary.withSummary(
  async (config: Config & CodePluginLeanplum) => {
    if (!config.codePluginLeanplum?.plugin?.ios?.swizzle) {
      await fsk.update(
        path.ios.infoPlistPath(config),
        /(<plist[\s\S]+?<dict>)/,
        `$1
    <key>LeanplumSwizzlingEnabled</key>
    <false/>`
      );

      await fsk.update(
        path.ios.appDelegatePath(config),
        /(#import "AppDelegate.h")/,
        `$1
#import <Leanplum.h>`
      );

      await fsk.update(
        path.ios.appDelegatePath(config),
        /(@end)(?![\s\S]*\1)/g,
        `
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
{
    [Leanplum didReceiveRemoteNotification:userInfo];
    completionHandler(UIBackgroundFetchResultNewData);
}

- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
    [Leanplum didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}

- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
{
    [Leanplum didFailToRegisterForRemoteNotificationsWithError:error];
}

$1`
      );
    }
  },
  "plugin-leanplum",
  "platform::ios"
);

const android = summary.withSummary(
  async (config: Config & CodePluginLeanplum) => {
    const version =
      config.codePluginLeanplum?.plugin?.android?.leanplumFCMVersion || "5.7.0";

    await fsk.update(
      path.android.gradlePath(),
      /(dependencies {)/,
      `$1
      implementation 'com.leanplum:leanplum-fcm:${version}'
      implementation 'com.google.firebase:firebase-messaging'
      implementation 'com.google.firebase:firebase-iid:21.1.0'`
    );

    await fsk.update(
      path.android.mainApplicationPath(config),
      /(^package [\s\S]+?;)/,
      `$1

import com.leanplum.Leanplum;
import com.leanplum.annotations.Parser;
import com.leanplum.LeanplumActivityHelper;`
    );

    await fsk.update(
      path.android.mainApplicationPath(config),
      /(super\.onCreate\(\);)/,
      `$1
    Leanplum.setApplicationContext(this);
    Parser.parseVariables(this);
    LeanplumActivityHelper.enableLifecycleCallbacks(this);
`
    );
  },
  "plugin-leanplum",
  "platform::android"
);

export * from "./types";

export { ios, android };
