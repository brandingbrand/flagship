import { plugins } from "../../../utils";

import type { Config } from "../../../types/types";
import type { InitOptions } from "../../../types/options";

export const execute = (options: InitOptions, config: Config) => {
  const runPlugins = async (
    configuration: object,
    installedPlugins: string[],
    platform: "ios" | "android"
  ) => {
    for (const installedPlugin of installedPlugins) {
      const bundle = require(installedPlugin);

      await bundle?.[platform]?.(configuration);
    }
  };

  return {
    ios: async () => runPlugins(config, plugins.get(), "ios"),
    android: async () => runPlugins(config, plugins.get(), "android"),
  };
};
