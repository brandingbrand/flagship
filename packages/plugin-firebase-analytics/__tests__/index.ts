/**
 * @jest-environment-options {"requireTemplate": true}
 */

import { BuildConfig, fs, path } from "@brandingbrand/code-cli-kit";

import plugin, { type CodePluginFirebaseAnalytics } from "../src";

describe("plugin-firebase-analytics", () => {
  it("ios enable ad identifier", async () => {
    const config: BuildConfig & CodePluginFirebaseAnalytics = {
      ios: {
        displayName: "App",
        bundleId: "com.app",
      },
      android: {
        displayName: "App",
        packageName: "com.app",
      },
      codePluginFirebaseAnalytics: {
        plugin: {
          ios: {
            disableAdId: false,
          },
        },
      },
    };

    await plugin.ios?.(config, {} as any);

    expect(await fs.readFile(path.ios.podfile, "utf-8")).not.toContain(
      "$RNFirebaseAnalyticsWithoutAdIdSupport = true"
    );
  });

  it("ios disable ad identifier", async () => {
    const config: BuildConfig & CodePluginFirebaseAnalytics = {
      ios: {
        displayName: "App",
        bundleId: "com.app",
      },
      android: {
        displayName: "App",
        packageName: "com.app",
      },
      codePluginFirebaseAnalytics: {
        plugin: {
          ios: {
            disableAdId: true,
          },
        },
      },
    };

    await plugin.ios?.(config, {} as any);

    expect(await fs.readFile(path.ios.podfile, "utf-8")).toContain(
      "$RNFirebaseAnalyticsWithoutAdIdSupport = true"
    );
  });
});
