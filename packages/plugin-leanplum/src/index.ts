import {
  Config,
  fsk,
  infoPlist,
  path,
  summary,
  colors,
} from "@brandingbrand/code-core";

import type { CodePluginLeanplum } from "./types";

const ios = summary.withSummary(
  async (config: Config & CodePluginLeanplum) => {
    if (!config.codePluginLeanplum?.plugin?.ios?.swizzle) {
      await infoPlist.setPlist(
        {
          LeanplumSwizzlingEnabled: false,
        },
        config
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

    await fsk.update(
      path.ios.podfilePath(),
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
  },
  "plugin-leanplum",
  "platform::ios"
);

const android = summary.withSummary(
  async (config: Config & CodePluginLeanplum) => {
    const version =
      config.codePluginLeanplum?.plugin?.android?.leanplumFCMVersion || "5.7.0";

    const notificationColor =
      config.codePluginLeanplum?.plugin.android?.notificationColor || "#000000";

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

    await fsk.update(
      path.android.mainApplicationPath(config),
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

    await colors.addColor("leanplum_notification_color", notificationColor);
  },
  "plugin-leanplum",
  "platform::android"
);

export * from "./types";

export { ios, android };
