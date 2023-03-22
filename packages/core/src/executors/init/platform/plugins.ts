import { path, plugins } from "../../../utils";
import { withSummary } from "../../../utils/summary";

import type { Config } from "../../../types/Config";
import type { InitOptions } from "../../../types/Options";

export const execute = (options: InitOptions, config: Config) => {
  const runPlugins = async (
    configuration: object,
    installedPlugins: string[],
    platform: "ios" | "android"
  ) => {
    for (const installedPlugin of installedPlugins) {
      const bundle = require(path.project.resolve(
        "node_modules",
        installedPlugin
      ));

      await bundle?.[platform]?.(configuration);
    }
  };

  return {
    ios: withSummary(
      async () => runPlugins(config, plugins.get(), "ios"),
      "plugins",
      "platform::ios"
    ),
    android: withSummary(
      async () => runPlugins(config, plugins.get(), "android"),
      "plugins",
      "platform::android"
    ),
  };
};
