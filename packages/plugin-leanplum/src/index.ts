/* eslint-disable no-useless-escape */

import { Config, fsk, path } from "@brandingbrand/kernel-core";

import type { KernelPluginLeanplum } from "./types";

const ios = async (config: Config & KernelPluginLeanplum) => {
  if (!config.kernelPluginLeanplum?.kernel.ios?.swizzle) {
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
"#import <Leanplum.h>"`
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

- (void)userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)(void))completionHandler
{
    [Leanplum didReceiveNotificationResponse:response];
    completionHandler();
}

-(void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler
{
    [Leanplum willPresentNotification:notification];
    completionHandler(UNNotificationPresentationOptionNone);
}

$1`
    );
  }
};

const android = async (config: KernelPluginLeanplum) => {
  const version =
    config.kernelPluginLeanplum?.kernel.android?.leanplumFCMVersion || "5.3.3";

  await fsk.update(
    path.android.gradlePath(),
    /(dependencies {)/,
    `$1
      implementation 'com.leanplum:leanplum-fcm:${version}'
      implementation 'com.google.firebase:firebase-messaging'`
  );
};

export * from "./types";

export { ios, android };
