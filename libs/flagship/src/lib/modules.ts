import { logInfo } from '../helpers';
import type { Config, NPMPackageConfig } from '../types';

import * as fs from './fs';
import * as path from './path';

const kModuleFileExtension = '.js';

export interface Module {
  preLink?: (config: Config) => void;
  postLink?: (config: Config) => void;
}

export type ModuleList = Record<string, Module>;

const fetchModules = (directory: string): ModuleList => {
  const initialModules: ModuleList = {};

  return fs
    .readdirSync(directory)
    .filter((filename: string) => kModuleFileExtension === path.extname(filename))
    .reduce((map: ModuleList, filename: string) => {
      const name = path.basename(filename, kModuleFileExtension);
      const src = path.resolve(directory, filename);

      map[name] = require(src);

      return map;
    }, initialModules);
};

// Loads all the .js files from the `modules` directory and creates a dictionary of filename to
// the exported object from that file
const androidModules = fetchModules(path.resolve(__dirname, 'modules', 'android'));
const iosModules = fetchModules(path.resolve(__dirname, 'modules', 'ios'));

/**
 * Looks through an array of dependencies and returns an array of module modifications which
 * must be executed.
 *
 * @param dependencies An array of dependencies to filter.
 * @param modules The set of modules to check for dependency matches.
 * @return An array of module modification scripts which must be executed for the
 * given set of dependencies.
 */
const getUsedModules = (dependencies: string[], modules: ModuleList): Module[] =>
  // Remove the private scope from the package name before checking for a module patcher
  // e.g. `@brandingbrand/react-native-zendesk-chat` becomes `react-native-zendesk-chat`
  dependencies
    .map((dependency) => {
      const [scopeOrModule, module] = dependency.split('/');
      return modules[(module || scopeOrModule) ?? ''];
    })
    .filter((module): module is Module => module !== undefined);
/**
 * Makes modifications to the boilerplate Android project to support native modules.
 *
 * @param packageJSON The project package.json
 * @param configuration The project configuration.
 * @param stage The build stage (preLink or postLink) for which module functions will run.
 */
export const android = (
  packageJSON: NPMPackageConfig,
  configuration: Config,
  stage: keyof Module
): void => {
  logInfo(`Running module scripts for android for init stage ${stage}`);

  for (const exported of getUsedModules(
    Object.keys(packageJSON.dependencies || {}),
    androidModules
  )) {
    const stageFn = exported[stage];

    if (stageFn && typeof stageFn === 'function') {
      stageFn(configuration);
    }
  }
};

/**
 * Makes modifications to the boilerplate iOS project to support native modules.
 *
 * @param packageJSON The project package.json
 * @param configuration The project configuration.
 * @param stage The build stage (preLink or postLink) for which module functions will run.
 */
export const ios = (
  packageJSON: NPMPackageConfig,
  configuration: Config,
  stage: keyof Module
): void => {
  logInfo(`Running module scripts for ios for init stage ${stage}`);

  for (const exported of getUsedModules(Object.keys(packageJSON.dependencies || {}), iosModules)) {
    const stageFn = exported[stage];

    if (stageFn && typeof stageFn === 'function') {
      stageFn(configuration);
    }
  }
};
