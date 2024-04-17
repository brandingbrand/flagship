/**
 * @jest-environment-options {"fixture": "__plugin-fbsdk-next_fixtures"}
 */

import { fs, path } from "@brandingbrand/code-core";

import { ios, android } from "../src";

describe("plugin-fbsdk-next", () => {
  it("ios", async () => {
    await ios({
      ...global.__FLAGSHIP_CODE_CONFIG__,
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
    });

    const infoPlist = (
      await fs.readFile(path.ios.infoPlistPath(global.__FLAGSHIP_CODE_CONFIG__))
    ).toString();
    const appDelegate = (
      await fs.readFile(
        path.ios.appDelegatePath(global.__FLAGSHIP_CODE_CONFIG__)
      )
    ).toString();

    expect(infoPlist).toMatch("<string>code-url-scheme</string>");
    expect(infoPlist).toMatch("<string>code-appid-0001</string>");
    expect(infoPlist).toMatch("<string>code-client-token-0001</string>");
    expect(infoPlist).toMatch("<string>fbapp</string>");
    expect(infoPlist).toMatch("<string>fbapp-sharing</string>");
    expect(appDelegate).toMatch(
      "[[FBSDKApplicationDelegate sharedInstance] application:application openURL:url options:options]"
    );
    expect(appDelegate)
      .toContain(`#import <AuthenticationServices/AuthenticationServices.h>
#import <SafariServices/SafariServices.h>
#import <FBSDKCoreKit/FBSDKCoreKit-Swift.h>`);
  });

  it("android", async () => {
    await android({
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
    });

    const strings = (await fs.readFile(path.android.stringsPath())).toString();
    const androidManifest = (
      await fs.readFile(path.android.manifestPath())
    ).toString();

    expect(strings).toMatch("0001");
    expect(strings).toMatch("code-client-token-0001");
    expect(androidManifest).toMatch(
      '<meta-data android:name="com.facebook.sdk.ApplicationId" android:value="@string/facebook_app_id"/>'
    );
    expect(androidManifest).toMatch(
      '<meta-data android:name="com.facebook.sdk.ClientToken" android:value="@string/facebook_client_token"/>'
    );
    expect(androidManifest).toMatch(
      'uses-permission android:name="android.permission.INTERNET"'
    );
    expect(androidManifest).toMatch(
      '<uses-permission android:name="com.google.android.gms.permission.AD_ID" tools:node="remove"/>'
    );
    expect(androidManifest).toMatch(
      '<provider android:authorities="com.facebook.app.FacebookContentProvider0001" android:name="com.facebook.FacebookContentProvider" android:exported="true"/>'
    );
  });
});
