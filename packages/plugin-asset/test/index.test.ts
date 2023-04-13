import { path } from "@brandingbrand/code-core";

import { ios, android } from "../src";

const linkAssetsPath = path.hoist.resolve("react-native-asset", "lib");

describe("plugin-asset", () => {
  jest.mock(linkAssetsPath);

  it("ios", async () => {
    const linkAssets = require(linkAssetsPath);
    await ios({
      codePluginAsset: { plugin: { assetPath: ["./assets/fonts"] } },
    });

    expect(linkAssets).toBeCalledWith({
      rootPath: path.project.path(),
      shouldUnlink: true,
      platforms: {
        ios: {
          enabled: true,
          assets: [path.config.resolve("./assets/fonts")],
        },
        android: {
          enabled: false,
          assets: [],
        },
      },
    });
  });

  it("android", async () => {
    const linkAssets = require(linkAssetsPath);
    await android({
      codePluginAsset: { plugin: { assetPath: ["./assets/fonts"] } },
    });

    expect(linkAssets).toBeCalledWith({
      rootPath: path.project.path(),
      shouldUnlink: true,
      platforms: {
        android: {
          enabled: true,
          assets: [path.config.resolve("./assets/fonts")],
        },
        ios: {
          enabled: false,
          assets: [],
        },
      },
    });
  });
});
