import {
  errors,
  fs,
  path,
  summary,
  packageManager,
} from "@brandingbrand/code-core";

import type { Config, Options } from "@brandingbrand/code-core";

export const execute = summary.withSummary(
  async (options: Options.InitOptions, config: Config) => {
    let envMatch = /env.\w+.js/;
    if (options.release) {
      envMatch = new RegExp(`env\\.${options.env}\\.js`);
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

    await packageManager.withVersion(
      "@brandingbrand/fsapp",
      async (packageVersion: string | undefined) => {
        if (!packageVersion) {
          throw new errors.Warning(
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

        throw new errors.Warning(
          `@brandingbrand/fsapp@${packageVersion} is installed but doesn't match v10.+, v11.+ or v12.+ - please install one of the matching versions to get access to the runtime env.`
        );
      }
    );
  },
  "env",
  "pre"
);
