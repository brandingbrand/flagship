import type { Config } from "@brandingbrand/kernel-core";

import { generated, legacy } from "./utils";
import type { KernelPluginSplashScreen } from "./types";

const ios = async (config: Config & KernelPluginSplashScreen) => {
  if (config.kernelPluginSplashScreen.kernel?.ios?.type === "generated") {
    return generated.ios(config);
  }

  if (config.kernelPluginSplashScreen.kernel?.ios?.type === "legacy") {
    return legacy.ios(config);
  }
};

const android = async (config: Config & KernelPluginSplashScreen) => {
  if (config.kernelPluginSplashScreen.kernel?.android?.type === "generated") {
    return generated.android(config);
  }

  if (config.kernelPluginSplashScreen.kernel?.android?.type === "legacy") {
    return legacy.android(config);
  }
};

export * from "./types";

export { ios, android };
