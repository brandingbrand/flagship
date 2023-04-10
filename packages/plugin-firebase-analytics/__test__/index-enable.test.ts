/**
 * @jest-environment-options {"fixture": "__plugin-firebase-analytics--enable_fixtures"}
 */

import { fs, path } from "@brandingbrand/code-core";

import { ios } from "../src";

describe("plugin-firebase-analytics", () => {
  it("ios enable ad id", async () => {
    await ios({
      codePluginFirebaseAnalytics: {
        plugin: {
          ios: {
            disableAdId: false,
          },
        },
      },
    });

    expect((await fs.readFile(path.ios.podfilePath())).toString()).not.toMatch(
      "$RNFirebaseAnalyticsWithoutAdIdSupport = true"
    );
  });
});
