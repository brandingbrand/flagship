import { path, summary } from "@brandingbrand/code-core";

import type { CodePluginAsset } from "./types";

const ios = summary.withSummary(
  async (config: CodePluginAsset) => {
    const { assetPath = ["./assets/fonts"] } =
      config.codePluginAsset?.plugin ?? {};

    const linkAsssets = require(path.hoist.resolve(
      "react-native-asset",
      "lib"
    ));

    await linkAsssets({
      rootPath: path.project.path(),
      shouldUnlink: true,
      platforms: {
        ios: {
          enabled: true,
          assets: assetPath.map((it) => path.config.resolve(it)),
        },
        android: {
          enabled: false,
          assets: [],
        },
      },
    });
  },
  "plugin-asset",
  "platform::ios"
);

const android = summary.withSummary(
  async (config: CodePluginAsset) => {
    const { assetPath = ["./assets/fonts"] } =
      config.codePluginAsset?.plugin ?? {};

    const linkAsssets = require(path.hoist.resolve(
      "react-native-asset",
      "lib"
    ));

    await linkAsssets({
      rootPath: path.project.path(),
      shouldUnlink: true,
      platforms: {
        ios: {
          enabled: false,
          assets: [],
        },
        android: {
          enabled: true,
          assets: assetPath.map((it) => path.config.resolve(it)),
        },
      },
    });
  },
  "plugin-asset",
  "platform::android"
);

export * from "./types";

export { ios, android };
