/**
 * @jest-environment-options {"requireTemplate": true}
 */

import { fs, type BuildConfig, path } from "@brandingbrand/code-cli-kit";

import plugin, { type CodePluginFBSDKNext } from "../src";

describe("plugin-fbsdk-next", () => {
  it("ios", async () => {
    const config: BuildConfig & CodePluginFBSDKNext = {
      ios: {
        displayName: "App",
        bundleId: "com.app",
      },
      android: {
        displayName: "App",
        packageName: "com.app",
      },
      codePluginFBSDKNext: {
        plugin: {
          ios: {
            appId: "code-appid-0001",
            clientToken: "code-client-token-0001",
            displayName: "code",
            urlScheme: "code-url-scheme",
            queriesSchemes: ["fbapp", "fbapp-sharing"],
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

    expect(infoPlistContent).toContain(`<array>
      <dict>
        <key>CFBundleURLSchemes</key>
        <array>
          <string>code-url-scheme</string>
        </array>
      </dict>
    </array>`);

    expect(infoPlistContent).toContain(`<key>LSApplicationQueriesSchemes</key>
    <array>
      <string>fbapp</string>
      <string>fbapp-sharing</string>
    </array>`);

    expect(infoPlistContent).toContain(`<key>FacebookAppID</key>
    <string>code-appid-0001</string>`);

    expect(infoPlistContent).toContain(`<key>FacebookDisplayName</key>
    <string>code</string>`);

    expect(appDelegateContent)
      .toContain(`if ([[FBSDKApplicationDelegate sharedInstance] application:application openURL:url options:options]) {
    return YES;
  }`);

    expect(appDelegateContent).toContain(
      "#import <FBSDKCoreKit/FBSDKCoreKit-Swift.h>"
    );
  });

  it("android", async () => {
    const config: BuildConfig & CodePluginFBSDKNext = {
      ios: {
        displayName: "App",
        bundleId: "com.app",
      },
      android: {
        displayName: "App",
        packageName: "com.app",
      },
      codePluginFBSDKNext: {
        plugin: {
          android: {
            appId: "0001",
            clientToken: "code-client-token-0001",
            advertisingIdOptOut: true,
            enableSharing: true,
          },
        },
      },
    };

    await plugin.android?.(config, {} as any);

    const stringsContent = await fs.readFile(path.android.strings, "utf-8");
    const androidManifestContent = await fs.readFile(
      path.android.androidManifest,
      "utf-8"
    );

    expect(stringsContent).toContain(
      '<string name="facebook_app_id">0001</string>'
    );
    expect(stringsContent).toContain(
      '<string name="facebook_client_token">code-client-token-0001</string>'
    );

    expect(androidManifestContent).toContain(
      '<meta-data android:name="com.facebook.sdk.ApplicationId" android:value="@string/facebook_app_id"/>'
    );
    expect(androidManifestContent).toContain(
      '<meta-data android:name="com.facebook.sdk.ClientToken" android:value="@string/facebook_client_token"/>'
    );
    expect(androidManifestContent).toContain(
      '<provider android:authorities="com.facebook.app.FacebookContentProvider0001" android:name="com.facebook.FacebookContentProvider" android:exported="true"/>'
    );
    expect(androidManifestContent).toContain(
      '<uses-permission android:name="com.google.android.gms.permission.AD_ID" tools:node="remove"/>'
    );
  });
});
