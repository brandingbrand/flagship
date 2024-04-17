/**
 * @jest-environment-options {"requireTemplate": true}
 */

import { fs, type BuildConfig, path } from "@brandingbrand/code-cli-kit";

import plugin, { CodePluginLeanplum } from "../src";

describe("plugin-leanplum", () => {
  it("ios", async () => {
    const config: BuildConfig & CodePluginLeanplum = {
      ios: {
        displayName: "App",
        bundleId: "com.app",
      },
      android: {
        displayName: "App",
        packageName: "com.app",
      },
      codePluginLeanplum: {
        plugin: {
          ios: {
            swizzle: false,
          },
        },
      },
    };

    await plugin.ios?.(config, {} as any);

    const infoPlistContent = await fs.readFile(path.ios.infoPlist, "utf-8");
    const appDelegateContent = await fs.readFile(
      path.project.resolve("ios", "app", "AppDelegate.mm"),
      "utf-8"
    );
    const appDelegateInterfaceContent = await fs.readFile(
      path.project.resolve("ios", "app", "AppDelegate.h"),
      "utf-8"
    );
    const podfileContent = await fs.readFile(path.ios.podfile, "utf-8");

    expect(infoPlistContent).toContain(`<key>LeanplumSwizzlingEnabled</key>
    <false/>`);
    expect(podfileContent).toContain(
      "dynamic_frameworks = ['Leanplum-iOS-SDK', 'CleverTap-iOS-SDK', 'SDWebImage']"
    );

    [
      "#import <UserNotifications/UserNotifications.h>",
      "@interface AppDelegate : RCTAppDelegate<UNUserNotificationCenterDelegate>",
    ].forEach((it) => {
      expect(appDelegateInterfaceContent).toContain(it);
    });

    [
      "#import <Leanplum.h>",
      "[[UNUserNotificationCenter currentNotificationCenter] setDelegate:self];",
      "[Leanplum start];",
      "[Leanplum applicationDidFinishLaunchingWithOptions:launchOptions];",
      "[Leanplum didReceiveRemoteNotification:userInfo];",
      "[Leanplum didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];",
      "[Leanplum didFailToRegisterForRemoteNotificationsWithError:error];",
      "[Leanplum didReceiveNotificationResponse:response];",
      "[Leanplum willPresentNotification:notification];",
    ].forEach((it) => {
      expect(appDelegateContent).toContain(it);
    });
  });

  it("android", async () => {
    const config: BuildConfig & CodePluginLeanplum = {
      ios: {
        displayName: "App",
        bundleId: "com.app",
      },
      android: {
        displayName: "App",
        packageName: "com.app",
      },
      codePluginLeanplum: {
        plugin: {
          android: {
            leanplumFCMVersion: "7.10.0",
            notificationColor: "#ffffff",
          },
        },
      },
    };

    await plugin.android?.(config, {} as any);

    const appBuildGradleContent = await fs.readFile(
      path.android.appBuildGradle,
      "utf-8"
    );
    const mainApplicationContent = await fs.readFile(
      path.android.mainApplication(config),
      "utf-8"
    );
    const colorsXmlContent = await fs.readFile(path.android.colors, "utf-8");

    [
      "implementation 'com.leanplum:leanplum-fcm:7.10.0'",
      "implementation 'com.google.firebase:firebase-messaging'",
      "implementation 'com.google.firebase:firebase-iid:21.1.0'",
    ].forEach((it) => expect(appBuildGradleContent).toContain(it));

    [
      "import com.leanplum.Leanplum;",
      "Leanplum.setApplicationContext(this);",
    ].forEach((it) => expect(mainApplicationContent).toContain(it));

    expect(colorsXmlContent).toContain(
      '<color name="leanplum_notification_color">#ffffff</color>'
    );
  });
});
