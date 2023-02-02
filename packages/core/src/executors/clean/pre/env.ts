/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { logger, path, rimraf } from "../../../utils";

import type { Config } from "../../../types/types";
import type { CleanOptions } from "../../../types/options";

export const execute = async (options: CleanOptions, config: Config) => {
  logger.logInfo("removing transpiled env files");

  await rimraf.async(`${path.config.envPath()}/**/*.js`, {});
};
