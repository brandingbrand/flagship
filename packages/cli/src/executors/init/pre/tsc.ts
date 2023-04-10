import {
  exec,
  fs,
  path,
  packageManager,
  summary,
} from "@brandingbrand/code-core";

import type { Config, Options } from "@brandingbrand/code-core";

export const execute = summary.withSummary(
  async (options: Options.InitOptions, config: Config) => {
    await packageManager.withPackageManager(
      async (packageManager, runCommand) => {
        await exec.async(
          `${packageManager} ${runCommand} tsc ${path.config.resolve(
            "env",
            "*.ts"
          )} --skipLibCheck`
        );
      }
    );

    await fs.copyFile(
      path.config.resolve("env", `env.${options.env}.js`),
      path.config.resolve("env", "env.js")
    );
  },
  "tsc",
  "pre"
);
