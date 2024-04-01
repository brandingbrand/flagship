/**
 * Defines a plugin for @brandingbrand/code-cli-kit.
 * @module Plugin
 */

import {
  definePlugin,
  path,
  withUTF8,
  string,
  withInfoPlist,
  withColors,
} from "@brandingbrand/code-cli-kit";

import type { CodePluginLeanplum } from "./types";

/**
 * Defines a plugin with functions for both iOS and Android platforms.
 * @alias module:Plugin
 * @param {BuildConfig} build - The build configuration object.
 * @param {PrebuildOptions} options - The options object.
 */
export default definePlugin<CodePluginLeanplum>({
  /**
   * Function to be executed for iOS platform.
   * @param {BuildConfig} build - The build configuration object for iOS.
   * @param {PrebuildOptions} options - The options object for iOS.
   * @returns {Promise<void>} A promise that resolves when the process completes.
   */
  ios: async function (build, options): Promise<void> {
    await withUTF8(
      path.project.resolve("ios", "app", "AppDelegate.mm"),
      (content) => {
        content = string.replace(
          content,
          /(^- \(BOOL\)[\s\S]+?didFinishLaunchingWithOptions[\s\S]+?{)/m,
          `$1
  [[UNUserNotificationCenter currentNotificationCenter] setDelegate:self];
  [Leanplum start];
  [Leanplum applicationDidFinishLaunchingWithOptions:launchOptions];
`
        );

        content = string.replace(
          content,
          /(#import "AppDelegate.h")/,
          `$1

#import <Leanplum.h>`
        );

        content = string.replace(
          content,
          /(@end)/,
          `- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
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

        return content;
      }
    );

    await withUTF8(
      path.project.resolve("ios", "app", "AppDelegate.h"),
      (content) => {
        content = string.replace(
          content,
          /(^#import[\s\S]+?\n)/,
          `$1
#import <UserNotifications/UserNotifications.h>
`
        );

        return string.replace(
          content,
          /(@interface[\s\S]+?RCTAppDelegate)/,
          `$1<UNUserNotificationCenterDelegate>`
        );
      }
    );

    if (!build.codePluginLeanplum.plugin.ios?.swizzle) {
      await withInfoPlist((plist) => {
        plist["LeanplumSwizzlingEnabled"] = false;

        return plist;
      });
    }

    withUTF8(path.ios.podfile, (content) => {
      return string.replace(
        content,
        /(post_install do \|installer\|)/,
        `
  dynamic_frameworks = ['Leanplum-iOS-SDK', 'CleverTap-iOS-SDK', 'SDWebImage']
  pre_install do |installer|
    Pod::Installer::Xcode::TargetValidator.send(:define_method, :verify_no_static_framework_transitive_dependencies) {}
    installer.pod_targets.each do |pod|
      if dynamic_frameworks.include?(pod.name)
        puts "Setting dynamic linking for #{pod.name}"
        def pod.build_type;
          Pod::BuildType.dynamic_framework
        end
      end
    end
  end

  $1`
      );
    });
  },

  /**
   * Function to be executed for Android platform.
   * @param {BuildConfig & CodePluginAsset} build - The build configuration object for Android.
   * @param {PrebuildOptions} options - The options object for Android.
   * @returns {Promise<void>} A promise that resolves when the process completes.
   */
  android: async function (build, options): Promise<void> {
    const { leanplumFCMVersion, notificationColor } = build.codePluginLeanplum
      .plugin.android || {
      leanplumFCMVersion: "5.7.0",
      notificationColor: "#000000",
    };

    await withUTF8(path.android.appBuildGradle, (content) => {
      return string.replace(
        content,
        /(dependencies {)/,
        `$1
    implementation 'com.leanplum:leanplum-fcm:${leanplumFCMVersion}'
    implementation 'com.google.firebase:firebase-messaging'
    implementation 'com.google.firebase:firebase-iid:21.1.0'`
      );
    });

    await withUTF8(path.android.mainApplication(build), (content) => {
      content = string.replace(
        content,
        /(^package [\s\S]+?;)/,
        `$1

import com.leanplum.Leanplum;
import com.leanplum.annotations.Parser;
import com.leanplum.LeanplumPushService;
import com.leanplum.LeanplumActivityHelper;
import com.leanplum.LeanplumPushNotificationCustomizer;
import android.app.Notification;
import android.content.Context;
import android.os.Bundle;
import androidx.core.app.NotificationCompat;
import androidx.core.content.ContextCompat;
import androidx.annotation.Nullable;`
      );

      return string.replace(
        content,
        /(super\.onCreate\(\);)/,
        `$1
    Leanplum.setApplicationContext(this);
    Parser.parseVariables(this);
    LeanplumActivityHelper.enableLifecycleCallbacks(this);
    LeanplumPushService.setCustomizer(new LeanplumPushNotificationCustomizer() {
        @Override
        public void customize(NotificationCompat.Builder builder, Bundle notificationPayload) {
            builder.setSmallIcon(R.mipmap.ic_notification);
            builder.setColor(ContextCompat.getColor(getApplicationContext(), R.color.leanplum_notification_color));
        }

        @Override
        public void customize(Notification.Builder builder, Bundle notificationPayload, @Nullable Notification.Style notificationStyle) {
            
        }
  });
`
      );
    });

    await withColors((xml) => {
      if (!xml.resources.color) {
        xml.resources = { ...xml.resources, color: [] };
      }

      xml.resources.color?.push({
        $: { name: "leanplum_notification_color" },
        _: notificationColor,
      });
    });
  },
});

export type { CodePluginLeanplum };
