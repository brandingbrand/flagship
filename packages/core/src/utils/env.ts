/* eslint-disable @typescript-eslint/no-explicit-any */

import fs from "./fs";

import * as path from "./path";

let config: any;

export const get = async () => {
  if (config) return config;

  if (
    await fs.pathExists(path.project.resolve(path.config.envPath(), "env.js"))
  ) {
    config = require(path.project.resolve(
      path.config.envPath(),
      "env.js"
    )).default;

    return config;
  }

  return {};
};

export const set = (_config: any) => {
  config = _config;
};
