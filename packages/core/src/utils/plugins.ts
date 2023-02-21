import camelCase from "lodash/camelCase";

import * as path from "./path";

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
