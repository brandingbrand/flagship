import { execSync } from "child_process";

import * as fs from "./fs";
import * as helpers from "./logger";
import * as _path from "./path";
import type { NPMPackageConfig } from "../types";

const kEnvReplacementRegex = /{ENV\.([^}]+)}/g;

/**
 * Normalizes a project name into a display name for the app.
 *
 * @param projectName The project name to normalize.
 * @return The display name for the app.
 */
const toAppName = (projectName: string): string => {
  const split = projectName.split("/");
  const moduleName = split[split.length - 1];

  return (
    moduleName
      ?.replace(/-/g, "_")
      .split("_")
      .map((w) => `${w[0]?.toUpperCase()}${w.slice(1)}`)
      .join("") ?? ""
  );
};

/**
 * Returns the path to the environment configuration file for the given environment.
 *
 * @param env The identifier for the environment for which to return the path.
 * @return The path to the environment configuration file.
 */
export const path = (env: string): string =>
  _path.project.resolve("env", `env.${env}.js`);

/**
 * Writes the current environment to env.js
 *
 * @param configuration The project environment configuration.
 */
export const writeEnv = (configuration: unknown): void => {
  fs.writeFileSync(
    _path.project.resolve("env", "env.js"),
    `module.exports = ${JSON.stringify(configuration, null, 2)}`
  );
};

/**
 * Overwrites any value in the form of `{ENV.XXX}` in the env.js file with the environment variable
 * `XXX`.
 *
 * @param configuration The project environment configuration.
 * @return The project environment configuration with ENV variables replaced.
 */
const overwriteEnv = (configuration: any): any =>
  Object.keys(configuration).reduce((accumulator: any, key: string) => {
    let value = configuration[key];

    if (value && !Array.isArray(value)) {
      switch (typeof value) {
        case "object":
          value = overwriteEnv(value);
          break;

        case "string":
          value = value.replace(
            kEnvReplacementRegex,
            (a: unknown, b: string) => process.env[b] || ""
          );
          break;

        default:
      }
    }

    accumulator[key] = value;

    return accumulator;
  }, {});

/**
 * Returns the project environment configuration object.
 *
 * @param env The identifier for the environment for which to return the configuration.
 * @param projectPackageJson The project package.json object
 * @return The project environment configuration.
 */
export const configuration = (
  env: string,
  projectPackageJson: NPMPackageConfig
): any => {
  let projectEnv;

  try {
    projectEnv = require(path(env));
  } catch {
    helpers.logWarn(
      "Environment configuration not found, fallback to default."
    );

    projectEnv = {
      name: toAppName(projectPackageJson.name),
    };
  }

  helpers.logInfo(
    `selected environment ${helpers.colors.FgGreen}${env}${helpers.colors.Reset}`
  );

  return {
    ...overwriteEnv(projectEnv),
    version: projectPackageJson.version,
  };
};

/**
 * Create a index file for project envs
 *
 * @param singleEnv Set if you want only a single environment added to the file
 */
export const createEnvIndex = (singleEnv?: string): void => {
  let envMatch = /env.\w+.js/;
  if (singleEnv) {
    envMatch = new RegExp(`env\\.${singleEnv}\\.js`);
    helpers.logInfo("Creating index file for default env");
  } else {
    helpers.logInfo("Creating index file for project envs");
  }

  const envs = fs
    .readdirSync(_path.project.resolve(".kernelrc", "env"))
    .filter((f: string) => f.match(envMatch));

  const envIndexFile = `module.exports = {\n${envs
    .map((env: string) => {
      const envName = /env.(\w+).js/.exec(env);
      return (
        envName &&
        `"${envName.pop()}": require(${JSON.stringify(
          _path.project.resolve(".kernelrc", "env", env)
        )}).default`
      );
    })
    .join(",\n")}\n}`;

  fs.writeFileSync(_path.app.resolve("src/project_env_index.js"), envIndexFile);
};

export const compile = (envName: string): void => {
  helpers.logInfo("running yarn tsc");

  try {
    execSync(
      `yarn tsc ${_path.project.resolve(
        ".kernelrc",
        "env",
        "*.ts"
      )} --skipLibCheck && cp ${_path.project.resolve(
        ".kernelrc",
        "env",
        `env.${envName}.js`
      )} ${_path.project.resolve(".kernelrc", "env", `env.js`)}`,
      {
        stdio: [0, 1, 2],
      }
    );
  } catch {
    helpers.logError(
      "yarn tsc failed, ensure <project_root>/.kernelrc/env folder exists with env.*.ts files"
    );

    process.exit(1);
  }
};
