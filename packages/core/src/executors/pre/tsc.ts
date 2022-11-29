import fs from "fs-extra";
import { execSync } from "child_process";

import { logger, path } from "../../utils";

export const execute = async (options: any, config: any, cliPath: string) => {
  logger.logInfo("executing tsc compile");

  execSync(
    `yarn tsc ${path.project.resolve(
      ".kernelrc",
      "env",
      "*.ts"
    )} --skipLibCheck`,
    {
      stdio: [0, 1, 2],
    }
  );

  await fs.copyFile(
    path.config.resolve("env", `env.${options.env}.js`),
    path.config.resolve("env", "env.js")
  );
};
