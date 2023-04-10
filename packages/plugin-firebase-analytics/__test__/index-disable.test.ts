/**
 * @jest-environment-options {"fixture": "__plugin-firebase-analytics--disable_fixtures"}
 */

import { fs, path } from "@brandingbrand/code-core";

import { ios } from "../src";

describe("plugin-firebase-analytics", () => {
  it("ios disable ad id", async () => {
    await ios({
      codePluginFirebaseAnalytics: {
        plugin: {
          ios: {
            disableAdId: true,
          },
        },
      },
    });

    expect((await fs.readFile(path.ios.podfilePath())).toString()).toMatch(
      "$RNFirebaseAnalyticsWithoutAdIdSupport = true"
    );
  });
});
