import { path } from "../../../utils";

export const execute = (options: any, config: any) => {
  const getPlugins = (): string[] => {
    const { kernel, devDependencies } = require(path.project.packagePath());

    if (!kernel?.plugins?.length) return [];

    return kernel.plugins.filter((it: string) =>
      Object.keys(devDependencies).includes(it)
    );
  };

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
    ios: async () => runPlugins(config, getPlugins(), "ios"),
    android: async () => runPlugins(config, getPlugins(), "android"),
  };
};
