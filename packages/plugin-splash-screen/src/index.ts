import { Config, summary } from "@brandingbrand/code-core";

import { generated, legacy } from "./utils";

import type { CodePluginSplashScreen } from "./types";

const ios = summary.withSummary(
  async (config: Config & CodePluginSplashScreen) => {
    if (config.codePluginSplashScreen.plugin?.ios?.type === "generated") {
      return generated.ios(config);
    }

    if (config.codePluginSplashScreen.plugin?.ios?.type === "legacy") {
      return legacy.ios(config);
    }
  },
  "plugin-splash-screen",
  "platform::ios"
);

const android = summary.withSummary(
  async (config: Config & CodePluginSplashScreen) => {
    if (config.codePluginSplashScreen.plugin?.android?.type === "generated") {
      return generated.android(config);
    }

    if (config.codePluginSplashScreen.plugin?.android?.type === "legacy") {
      return legacy.android(config);
    }
  },
  "plugin-splash-screen",
  "platform::android"
);

export * from "./types";

export { ios, android };
