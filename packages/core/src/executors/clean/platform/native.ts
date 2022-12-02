/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { logger, path, rimraf } from "../../../utils";

export const execute = (options: any, config: any, cliPath: string) => ({
  ios: async () => {
    logger.logInfo("removing ios dir");

    await rimraf.async(path.project.resolve("ios"), {});
  },
  android: async () => {
    logger.logInfo("removing android dir");

    await rimraf.async(path.project.resolve("android"), {});
  },
});
