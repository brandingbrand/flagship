import fs from "fs-extra";

import { logger, path } from "../../../utils";
import { Warning } from "../../../utils/errors";
import { withSummary } from "../../../utils/summary";
import { withVersion } from "../../../utils/package-manager";

import type { Config } from "../../../types/Config";
import type { InitOptions } from "../../../types/Options";

export const execute = withSummary(
  async (options: InitOptions, config: Config) => {
    let envMatch = /env.\w+.js/;
    if (options.release) {
      envMatch = new RegExp(`env\\.${options.env}\\.js`);
      logger.logInfo("Creating index file for default env");
    } else {
      logger.logInfo("Creating index file for project envs");
    }

    const envs = (await fs.readdir(path.config.resolve("env"))).filter(
      (f: string) => f.match(envMatch)
    );

    const envIndexFile = `module.exports = {\n${envs
      .map((env: string) => {
        const envName = /env.(\w+).js/.exec(env);
        return (
          envName &&
          `"${envName.pop()}": require(${JSON.stringify(
            path.config.resolve("env", env)
          )}).default`
        );
      })
      .join(",\n")}\n}`;

    await withVersion(
      "@brandingbrand/fsapp",
      async (packageVersion: string | undefined) => {
        if (!packageVersion) {
          throw new Warning(
            "@brandingbrand/fsapp v10.+, v11.+ or v12.+ is not installed; runtime env will not be accessible. The runtime env will be accessible in a more targeted package in the future."
          );
        }

        if (packageVersion.match(/^10./)) {
          return fs.writeFile(
            path.app.resolve("project_env_index.js"),
            envIndexFile
          );
        }

        if (packageVersion.match(/^11./) || packageVersion.match(/^12./)) {
          return fs.writeFile(
            path.app.resolve("src/project_env_index.js"),
            envIndexFile
          );
        }

        throw new Warning(
          `@brandingbrand/fsapp@${packageVersion} is installed but doesn't match v10.+, v11.+ or v12.+ - please install one of the matching versions to get access to the runtime env.`
        );
      }
    );
  },
  "env",
  "pre"
);
