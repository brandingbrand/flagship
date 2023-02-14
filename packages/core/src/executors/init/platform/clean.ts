/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { fs, logger, path, rimraf } from "../../../utils";

import type { Config } from "../../../types/types";
import type { CleanOptions } from "../../../types/options";

export const execute = (options: CleanOptions, config: Config) => ({
  ios: async () => {
    logger.logInfo("removing ios dir");

    if (await fs.pathExists(path.project.resolve("ios"))) {
      await rimraf.async(path.project.resolve("ios"), {});
    }
  },
  android: async () => {
    logger.logInfo("removing android dir");

    if (await fs.pathExists(path.project.resolve("android"))) {
      await rimraf.async(path.project.resolve("android"), {});
    }
  },
});
