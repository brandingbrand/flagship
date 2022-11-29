import fs from "fs-extra";

import { logger, path } from "../../utils";

export const execute = async (options: any, config: any, cliPath: string) => {
  let envMatch = /env.\w+.js/;
  if (options.release) {
    envMatch = new RegExp(`env\\.${options.env}\\.js`);
    logger.logInfo("Creating index file for default env");
  } else {
    logger.logInfo("Creating index file for project envs");
  }

  const envs = (
    await fs.readdir(path.project.resolve(".kernelrc", "env"))
  ).filter((f: string) => f.match(envMatch));

  const envIndexFile = `module.exports = {\n${envs
    .map((env: string) => {
      const envName = /env.(\w+).js/.exec(env);
      return (
        envName &&
        `"${envName.pop()}": require(${JSON.stringify(
          path.project.resolve(".kernelrc", "env", env)
        )}).default`
      );
    })
    .join(",\n")}\n}`;

  await fs.writeFile(
    path.app.resolve("src/project_env_index.js"),
    envIndexFile
  );
};
