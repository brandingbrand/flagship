import fs from "fs-extra";

import { exec, logger, path } from "../../../utils";
import { withSummary } from "../../../utils/summary";
import { withPackageManager } from "../../../utils/package-manager";

import type { Config } from "../../../types/types";
import type { InitOptions } from "../../../types/options";

export const execute = withSummary(
  async (options: InitOptions, config: Config) => {
    logger.logInfo("executing tsc compile");

    await withPackageManager(async (packageManager, runCommand) => {
      await exec.async(
        `${packageManager} ${runCommand} tsc ${path.config.resolve(
          "env",
          "*.ts"
        )} --skipLibCheck`
      );
    });

    await fs.copyFile(
      path.config.resolve("env", `env.${options.env}.js`),
      path.config.resolve("env", "env.js")
    );
  },
  "tsc",
  "pre"
);
