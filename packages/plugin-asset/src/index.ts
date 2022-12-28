import { path } from "@brandingbrand/kernel-core";

import type { KernelPluginAsset } from "./types";

const ios = async (config: KernelPluginAsset) => {
  const { assetPath = ["./assets/fonts"] } =
    config.kernelPluginAsset?.kernel ?? {};

  const linkAsssets = require(path.project.resolve(
    "node_modules",
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
};

const android = async (config: KernelPluginAsset) => {
  const { assetPath = ["./assets/fonts"] } =
    config.kernelPluginAsset?.kernel ?? {};

  const linkAsssets = require(path.project.resolve(
    "node_modules",
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
};

export * from "./types";

export { ios, android };
