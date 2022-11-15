/* eslint-disable @typescript-eslint/no-var-requires */
import * as path from "./path";

/**
 * Gets all installed dependencies
 *
 * @returns {string[]} array of installed plugins
 */
export const get = (): string[] => {
  const { reactor, devDependencies } = require(`${path.project.resolve(
    "package.json"
  )}`);

  return reactor.bundles.filter((it: string) =>
    Object.keys(devDependencies).includes(it)
  );
};

/**
 * Executes each installed plugin
 *
 * @param configuration {object} env configuration
 * @param installedPlugins {string[]} installed plugins
 * @param platform {string} platform
 */
export const execute = async (
  configuration: object,
  installedPlugins: string[],
  platform: "ios" | "android"
) => {
  for (const installedPlugin of installedPlugins) {
    const bundle = require(installedPlugin);

    await bundle?.[platform]?.(configuration);
  }
};
