import camelCase from "lodash/camelCase";

import * as path from "./path";

/**
 * Retrieves the list of plugins used in the project, if available.
 *
 * @returns {string[]} An array of plugin names.
 */
export const get = (): string[] => {
  const { code, devDependencies } = require(path.project.packagePath());

  if (!code?.plugins?.length) return [];

  return code.plugins.filter((it: string) =>
    Object.keys(devDependencies).includes(it)
  );
};

export const normalize = (bundleName: string) => {
  if (bundleName.includes("/")) {
    return camelCase(bundleName.split("/")[1]);
  }

  return camelCase(bundleName);
};
