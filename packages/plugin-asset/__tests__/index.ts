import { type BuildConfig, path } from "@brandingbrand/code-cli-kit";

import plugin, { type CodePluginAsset } from "../src";

jest.mock("react-native-asset");

import mockLinkAssets from "react-native-asset";

describe("plugin-asset", () => {
  const config: BuildConfig & CodePluginAsset = {
    ios: {
      bundleId: "com.app",
      displayName: "App",
    },
    android: {
      packageName: "com.app",
      displayName: "App",
    },
    codePluginAsset: {
      plugin: {
        assetPath: ["./path/to/assets"],
      },
    },
  };

  it("ios", async () => {
    await plugin.ios?.(config, {} as any);

    expect(mockLinkAssets).toHaveBeenCalledWith({
      rootPath: process.cwd(),
      shouldUnlink: true,
      platforms: {
        ios: {
          enabled: true,
          assets: ["./path/to/assets"].map((it) => path.project.resolve(it)),
        },
        android: {
          enabled: false,
          assets: ["./path/to/assets"].map((it) => path.project.resolve(it)),
        },
      },
    });
  });

  it("android", async () => {
    await plugin.android?.(config, {} as any);

    expect(mockLinkAssets).toHaveBeenCalledWith({
      rootPath: process.cwd(),
      shouldUnlink: true,
      platforms: {
        ios: {
          enabled: false,
          assets: ["./path/to/assets"].map((it) => path.project.resolve(it)),
        },
        android: {
          enabled: true,
          assets: ["./path/to/assets"].map((it) => path.project.resolve(it)),
        },
      },
    });
  });
});
