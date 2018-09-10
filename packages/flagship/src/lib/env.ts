import { NPMPackageConfig } from '../types';
import * as fs from './fs';
import * as helpers from '../helpers';
import {
  app,
  project
} from './path';

const kEnvReplacementRegex = /\{ENV\.([^}]+)\}/g;

/**
 * Normalizes a project name into a display name for the app.
 *
 * @param {string} projectName The project name to normalize.
 * @returns {string} The display name for the app.
 */
function toAppName(projectName: string): string {
  const split = projectName.split('/');
  const moduleName = split[split.length - 1];

  return moduleName
    .replace(/-/g, '_')
    .split('_')
    .map(w => `${w[0].toUpperCase()}${w.substring(1)}`)
    .join('');
}

/**
 * Returns the path to the environment configuration file for the given environment.
 *
 * @param {string} env The identifier for the environment for which to return the path.
 * @returns {string} The path to the environment configuration file.
 */
export function path(env: string): string {
  return project.resolve('env', `env.${env}.js`);
}

/**
 * Writes the current environment to env.js
 *
 * @param {object} configuration The project environment configuration.
 */
export function write(configuration: any): void {
  fs.writeFileSync(
    project.resolve('env', 'env.js'),
    `module.exports = ${JSON.stringify(configuration, null, 2)}`
  );
}

/**
 * Overwrites any value in the form of `{ENV.XXX}` in the env.js file with the environment variable
 * `XXX`.
 *
 * @param {object} configuration The project environment configuration.
 * @returns {object} The project environment configuration with ENV variables replaced.
 */
function overwriteEnv(configuration: any): any {
  return Object
    .keys(configuration)
    .reduce((accumulator: any, key: string) => {
      let value = configuration[key];

      if (value && !Array.isArray(value)) {
        switch (typeof value) {
          case 'object':
            value = overwriteEnv(value);
            break;

          case 'string':
            value = value.replace(kEnvReplacementRegex,
              (a: any, b: string) => process.env[b] || '');
            break;

          default:
        }
      }

      accumulator[key] = value;

      return accumulator;
    }, {});
}

/**
 * Returns the project environment configuration object.
 *
 * @param {string} env The identifier for the environment for which to return the configuration.
 * @param {object} projectPackageJson The project package.json object
 * @returns {object} The project environment configuration.
 */
export function configuration(env: string, projectPackageJson: NPMPackageConfig): any {
  let projectEnv;

  try {
    projectEnv = require(path(env));
  } catch (err) {
    helpers.logWarn('Environment configuration not found, fallback to default.');

    projectEnv = {
      name: toAppName(projectPackageJson.name)
    };
  }

  helpers.logInfo(`selected environment ${helpers.colors.FgGreen}${env}${helpers.colors.Reset}`);

  return {
    ...overwriteEnv(projectEnv),
    version: projectPackageJson.version
  };
}

/**
 * Create a index file for project envs
 */
export function createEnvIndex(): void {
  helpers.logInfo('Creating index file for project envs');

  const envs = fs
    .readdirSync(project.resolve('env'))
    .filter((f: string) => f.match(/env.[\w]+.js/));

  const envIndexFile = `module.exports = {\n${envs
    .map((env: string) => {
      const envName = env.match(/env.([\w]+).js/);
      return envName &&
        `"${envName.pop()}": require(${JSON.stringify(project.resolve('env', env))})`;
    })
    .join(',\n')}\n}`;

  fs.writeFileSync(app.resolve('project_env_index.js'), envIndexFile);
}
