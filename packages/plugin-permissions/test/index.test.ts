/**
 * @jest-environment-options {"fixture": "__plugin-permissions_fixtures"}
 */

import { path, fs } from "@brandingbrand/code-core";

import { ios, android } from "../src";

describe("plugin-permissions", () => {
  it("ios", async () => {
    await ios({
      ...global.__FLAGSHIP_CODE_CONFIG__,
      codePluginPermissions: {
        plugin: {
          ios: [
            {
              permission: "APP_TRACKING_TRANSPARENCY",
              text: "This is a test",
            },
            {
              permission: "NOTIFICATIONS",
            },
            {
              permission: "LOCATION_ALWAYS",
              text: "This is a test location always",
            },
          ],
        },
      },
    });

    const podspec = (
      await fs.readFile(
        path.hoist.resolve("react-native-permissions", "RNPermissions.podspec")
      )
    ).toString();
    const infoPlist = (
      await fs.readFile(path.ios.infoPlistPath(global.__FLAGSHIP_CODE_CONFIG__))
    ).toString();

    expect(podspec).toMatch("ios/AppTrackingTransparency/*.{h,m,mm}");
    expect(podspec).toMatch("ios/Notifications/*.{h,m,mm}");
    expect(podspec).toMatch("ios/LocationAlways/*.{h,m,mm}");
    expect(infoPlist).toMatch("NSUserTrackingUsageDescription");
    expect(infoPlist).toMatch("NSLocationAlwaysUsageDescription");
    expect(infoPlist).toMatch("NSLocationWhenInUseUsageDescription");
    expect(infoPlist).toMatch("NSLocationAlwaysAndWhenInUseUsageDescription");
  });

  it("android", async () => {
    await android({
      codePluginPermissions: {
        plugin: {
          android: [
            "ACCESS_FINE_LOCATION",
            "ACCESS_COARSE_LOCATION",
            "BIND_CARRIER_SERVICES",
          ],
        },
      },
    });

    const manifest = (
      await fs.readFile(path.android.manifestPath())
    ).toString();

    expect(manifest).toMatch(
      '<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>'
    );
    expect(manifest).toMatch(
      '<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>'
    );
    expect(manifest).toMatch(
      '<uses-permission android:name="android.permission.BIND_CARRIER_SERVICES"/>'
    );
  });
});
