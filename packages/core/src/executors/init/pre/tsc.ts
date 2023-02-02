import fs from "fs-extra";

import { exec, logger, path } from "../../../utils";

import type { Config } from "../../../types/types";
import type { InitOptions } from "../../../types/options";

export const execute = async (options: InitOptions, config: Config) => {
  logger.logInfo("executing tsc compile");

  await exec.async(
    `yarn tsc ${path.project.resolve(
      ".kernelrc",
      "env",
      "*.ts"
    )} --skipLibCheck`
  );

  await fs.copyFile(
    path.config.resolve("env", `env.${options.env}.js`),
    path.config.resolve("env", "env.js")
  );
};
