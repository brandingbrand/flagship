import { path, plugins, summary } from "@brandingbrand/code-core";

import type { Config, Options } from "@brandingbrand/code-core";

export const execute = (options: Options.InitOptions, config: Config) => {
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
    ios: summary.withSummary(
      async () => runPlugins(config, plugins.get(), "ios"),
      "plugins",
      "platform::ios"
    ),
    android: summary.withSummary(
      async () => runPlugins(config, plugins.get(), "android"),
      "plugins",
      "platform::android"
    ),
  };
};
