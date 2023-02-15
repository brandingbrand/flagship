import { Config, summary } from "@brandingbrand/kernel-core";

import { generated, legacy } from "./utils";
import type { KernelPluginSplashScreen } from "./types";

const ios = summary.withSummary(
  async (config: Config & KernelPluginSplashScreen) => {
    if (config.kernelPluginSplashScreen.kernel?.ios?.type === "generated") {
      return generated.ios(config);
    }

    if (config.kernelPluginSplashScreen.kernel?.ios?.type === "legacy") {
      return legacy.ios(config);
    }
  },
  "plugin-splash-screen",
  "platform::ios"
);

const android = summary.withSummary(
  async (config: Config & KernelPluginSplashScreen) => {
    if (config.kernelPluginSplashScreen.kernel?.android?.type === "generated") {
      return generated.android(config);
    }

    if (config.kernelPluginSplashScreen.kernel?.android?.type === "legacy") {
      return legacy.android(config);
    }
  },
  "plugin-splash-screen",
  "platform::android"
);

export * from "./types";

export { ios, android };
