import { fs, path } from "@brandingbrand/code-core";

import { ios } from "../src";

describe("plugin-firebase-analytics", () => {
  beforeEach(async () => {
    return fs.copyFile(
      path.resolve(__dirname, "fixtures", "Podfile"),
      path.resolve(__dirname, "fixtures", "__Podfile")
    );
  });

  afterEach(async () => {
    return fs.remove(path.resolve(__dirname, "fixtures", "__Podfile"));
  });

  it("ios disable ad id", async () => {
    jest
      .spyOn(path.ios, "podfilePath")
      .mockReturnValue(path.resolve(__dirname, "fixtures", "__Podfile"));

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

  it("ios enable ad id", async () => {
    jest
      .spyOn(path.ios, "podfilePath")
      .mockReturnValue(path.resolve(__dirname, "fixtures", "__Podfile"));

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
