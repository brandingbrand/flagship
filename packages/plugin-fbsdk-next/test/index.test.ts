import { fs, path } from "@brandingbrand/code-core";

import { ios, android } from "../src";

describe("plugin-fbsdk-next", () => {
  beforeAll(async () => {
    return fs.copy(
      path.resolve(__dirname, "fixtures"),
      path.resolve(__dirname, "__facebook_fixtures")
    );
  });

  afterAll(async () => {
    return fs.remove(path.resolve(__dirname, "__facebook_fixtures"));
  });

  it("ios", async () => {
    jest
      .spyOn(path.ios, "infoPlistPath")
      .mockReturnValue(
        path.resolve(__dirname, "__facebook_fixtures", "Info.plist")
      );

    jest
      .spyOn(path.ios, "appDelegatePath")
      .mockReturnValue(
        path.resolve(__dirname, "__facebook_fixtures", "AppDelegate.mm")
      );

    await ios({
      ios: { name: "HelloWorld" },
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
    } as never);

    const infoPlist = (
      await fs.readFile(
        path.resolve(__dirname, "__facebook_fixtures", "Info.plist")
      )
    ).toString();

    const appDelegate = (
      await fs.readFile(
        path.resolve(__dirname, "__facebook_fixtures", "AppDelegate.mm")
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
  });

  it("android", async () => {
    jest
      .spyOn(path.android, "manifestPath")
      .mockReturnValue(
        path.resolve(__dirname, "__facebook_fixtures", "AndroidManifest.xml")
      );
    jest
      .spyOn(path.android, "stringsPath")
      .mockReturnValue(
        path.resolve(__dirname, "__facebook_fixtures", "strings.xml")
      );

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

    const strings = (
      await fs.readFile(
        path.resolve(__dirname, "__facebook_fixtures", "strings.xml")
      )
    ).toString();

    const androidManifest = (
      await fs.readFile(
        path.resolve(__dirname, "__facebook_fixtures", "AndroidManifest.xml")
      )
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
      '<provider android:authorities="com.facebook.app.FacebookContentProvider0001" android:name="com.facebook.FacebookContentProvider" android:exported="true" />'
    );
  });
});
