/**
 * @jest-environment-options {"requireTemplate": true}
 */

import { fs, type BuildConfig, path } from "@brandingbrand/code-cli-kit";

import plugin from "../src";
import type { CodePluginPermissions } from "../src/types";

describe("plugin-permissions", () => {
  jest.spyOn(fs, "writeFile").mockImplementation(jest.fn());

  it("ios", async () => {
    const config: BuildConfig & CodePluginPermissions = {
      ios: {
        bundleId: "com.app",
        displayName: "App",
      },
      android: {
        packageName: "com.app",
        displayName: "App",
      },
      codePluginPermissions: {
        plugin: {
          ios: [
            {
              permission: "AppTrackingTransparency",
              text: "Let me use your ad identifier",
            },
            {
              permission: "LocationAccuracy",
              purposeKey: "full-accuracy",
              text: "Let me use your precise location temporarily",
            },
          ],
        },
      },
    };

    await plugin.ios?.(config, {} as any);

    expect(fs.writeFile).toHaveBeenCalledWith(
      require.resolve("react-native-permissions/RNPermissions.podspec"),
      expect.stringContaining(
        'ios/*.{h,m,mm}, "ios/AppTrackingTransparency/*.{h,m,mm}"'
      ),
      "utf-8"
    );
    expect(await fs.readFile(path.ios.infoPlist, "utf-8"))
      .toContain(`<key>NSUserTrackingUsageDescription</key>
    <string>Let me use your ad identifier</string>`);
    expect(await fs.readFile(path.ios.infoPlist, "utf-8"))
      .toContain(`<key>NSLocationTemporaryUsageDescriptionDictionary</key>
    <dict>
      <key>full-accuracy</key>
      <string>Let me use your precise location temporarily</string>
    </dict>`);
  });

  it("ios throw error", async () => {
    const config: BuildConfig & CodePluginPermissions = {
      ios: {
        bundleId: "com.app",
        displayName: "App",
      },
      android: {
        packageName: "com.app",
        displayName: "App",
      },
      codePluginPermissions: {
        plugin: {
          ios: [
            // @ts-ignore
            {
              permission: "LocationAccuracy",
              text: "Let me use your precise location temporarily",
            },
          ],
        },
      },
    };

    try {
      await plugin.ios?.(config, {} as any);

      expect(true).toBe(false);
    } catch (e: any) {
      expect(e.message).toContain("[CodePermissionsPluginError]");
    }
  });

  it("android", async () => {
    const config: BuildConfig & CodePluginPermissions = {
      ios: {
        bundleId: "com.app",
        displayName: "App",
      },
      android: {
        packageName: "com.app",
        displayName: "App",
      },
      codePluginPermissions: {
        plugin: {
          android: ["CAMERA"],
        },
      },
    };

    await plugin.android?.(config, {} as any);

    expect(await fs.readFile(path.android.androidManifest, "utf-8")).toContain(
      '<uses-permission android:name="android.permission.CAMERA"/>'
    );
  });
});
