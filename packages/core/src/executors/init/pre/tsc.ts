import fs from "fs-extra";

import { exec, path } from "../../../utils";
import { withSummary } from "../../../utils/summary";
import { withPackageManager } from "../../../utils/package-manager";

import type { Config } from "../../../types/Config";
import type { InitOptions } from "../../../types/Options";

export const execute = withSummary(
  async (options: InitOptions, config: Config) => {
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
