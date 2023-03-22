import { logger, path, rimraf } from "../../../utils";

import type { Config } from "../../../types/Config";
import type { CleanOptions } from "../../../types/Options";

export const execute = (options: CleanOptions, config: Config) => ({
  ios: async () => {
    logger.logInfo("removing ios dir");

    await rimraf.async(path.project.resolve("ios"), {});
  },
  android: async () => {
    logger.logInfo("removing android dir");

    await rimraf.async(path.project.resolve("android"), {});
  },
});
