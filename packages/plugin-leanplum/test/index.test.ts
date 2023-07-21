/**
 * @jest-environment-options {"fixture": "__plugin-leanplum_fixtures"}
 */

import { fs, path } from "@brandingbrand/code-core";

import { ios, android } from "../src";

describe("plugin-leanplum", () => {
  it("ios", async () => {
    await ios({
      ...global.__FLAGSHIP_CODE_CONFIG__,
      codePluginLeanplum: {
        plugin: {
          ios: {
            swizzle: false,
          },
        },
      },
    });

    expect(
      (
        await fs.readFile(
          path.ios.infoPlistPath(global.__FLAGSHIP_CODE_CONFIG__)
        )
      ).toString()
    ).toMatch("LeanplumSwizzlingEnabled");

    expect(
      (
        await fs.readFile(
          path.ios.appDelegatePath(global.__FLAGSHIP_CODE_CONFIG__)
        )
      ).toString()
    ).toMatch("didRegisterForRemoteNotificationsWithDeviceToken");

    expect(
      (
        await fs.readFile(
          path.ios.appDelegatePath(global.__FLAGSHIP_CODE_CONFIG__)
        )
      ).toString()
    ).toMatch(
      "[[UNUserNotificationCenter currentNotificationCenter] setDelegate:self];"
    );

    expect(
      (
        await fs.readFile(
          path.ios.appDelegatePath(global.__FLAGSHIP_CODE_CONFIG__)
        )
      ).toString()
    ).toMatch("[Leanplum start];");

    expect(
      (
        await fs.readFile(
          path.ios.appDelegatePath(global.__FLAGSHIP_CODE_CONFIG__)
        )
      ).toString()
    ).toMatch(
      "[Leanplum applicationDidFinishLaunchingWithOptions:launchOptions];"
    );

    expect(
      (
        await fs.readFile(
          path.ios.appDelegatePath(global.__FLAGSHIP_CODE_CONFIG__)
        )
      ).toString()
    ).toMatch("[Leanplum didReceiveNotificationResponse:response];");

    expect(
      (
        await fs.readFile(
          path.ios.appDelegatePath(global.__FLAGSHIP_CODE_CONFIG__)
        )
      ).toString()
    ).toMatch("[Leanplum willPresentNotification:notification];");

    expect(
      (
        await fs.readFile(
          path.project.resolve(
            "ios",
            __FLAGSHIP_CODE_CONFIG__.ios.name,
            "AppDelegate.h"
          )
        )
      ).toString()
    ).toMatch("#import <UserNotifications/UserNotifications.h>");

    expect(
      (
        await fs.readFile(
          path.project.resolve(
            "ios",
            __FLAGSHIP_CODE_CONFIG__.ios.name,
            "AppDelegate.h"
          )
        )
      ).toString()
    ).toMatch("<UNUserNotificationCenterDelegate>");

    expect((await fs.readFile(path.ios.podfilePath())).toString()).toMatch(`
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
  end`);
  });

  it("android", async () => {
    await android(global.__FLAGSHIP_CODE_CONFIG__);

    const buildGradle = (
      await fs.readFile(path.android.gradlePath())
    ).toString();
    const mainApplication = (
      await fs.readFile(
        path.android.mainApplicationPath(global.__FLAGSHIP_CODE_CONFIG__)
      )
    ).toString();
    const colors = (await fs.readFile(path.android.colorsPath())).toString();

    expect(buildGradle).toMatch(
      "implementation 'com.leanplum:leanplum-fcm:5.7.0'"
    );
    expect(buildGradle).toMatch(
      "implementation 'com.google.firebase:firebase-messaging'"
    );
    expect(mainApplication).toMatch("import com.leanplum.Leanplum;");
    expect(mainApplication).toMatch("import com.leanplum.annotations.Parser;");
    expect(mainApplication).toMatch(
      "import com.leanplum.LeanplumActivityHelper;"
    );
    expect(mainApplication).toMatch("Leanplum.setApplicationContext(this);");
    expect(mainApplication).toMatch("Parser.parseVariables(this);");
    expect(mainApplication).toMatch(
      "LeanplumActivityHelper.enableLifecycleCallbacks(this);"
    );
    expect(mainApplication).toMatch(
      `Leanplum.setApplicationContext(this);
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
  });`
    );
    expect(colors).toMatch(
      '<color name="leanplum_notification_color">#000000</color>'
    );
  });
});
