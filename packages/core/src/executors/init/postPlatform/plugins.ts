import { plugins } from "../../../utils";

export const execute = (options: any, config: any) => {
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
