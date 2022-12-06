/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { logger, path, rimraf } from "../../../utils";

export const execute = async (options: any, config: any) => {
  logger.logInfo("removing transpiled env files");

  await rimraf.async(`${path.config.envPath()}/**/*.js`, {});
};
