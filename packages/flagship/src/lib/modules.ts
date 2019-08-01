import * as fs from './fs';
import * as path from './path';
import { Config,
  NPMPackageConfig
} from '../types';
import { logInfo } from '../helpers';
const kModuleFileExtension = '.js';

export interface Module {
  preLink?: (config: Config) => void;
  postLink?: (config: Config) => void;
}

export interface ModuleList {
  [k: string]: Module;
}

// Loads all the .js files from the `modules` directory and creates a dictionary of filename to
// the exported object from that file
const androidModules = fetchModules(path.resolve(__dirname, 'modules', 'android'));
const iosModules = fetchModules(path.resolve(__dirname, 'modules', 'ios'));

function fetchModules(directory: string): ModuleList {
  const initialModules: ModuleList = {};

  return fs.readdirSync(directory)
    .filter((filename: string) => kModuleFileExtension === path.extname(filename))
    .reduce((map: ModuleList, filename: string) => {
      const name = path.basename(filename, kModuleFileExtension);
      const src = path.resolve(directory, filename);

      map[name] = require(src);

      return map;
    }, initialModules);
}

/**
 * Looks through an array of dependencies and returns an array of module modifications which
 * must be executed.
 *
 * @param {string[]} dependencies An array of dependencies to filter.
 * @param {ModuleList} modules The set of modules to check for dependency matches.
 * @returns {string[]} An array of module modification scripts which must be executed for the
 * given set of dependencies.
 */
function getUsedModules(dependencies: string[], modules: ModuleList): Module[] {
  // Remove the private scope from the package name before checking for a module patcher
  // e.g. `@brandingbrand/react-native-zendesk-chat` becomes `react-native-zendesk-chat`
  return dependencies
    .map(dependency => {
      const [scopeOrModule, module] = dependency.split('/');
      return modules[module || scopeOrModule];
    })
    .filter(Boolean);
}

/**
 * Makes modifications to the boilerplate Android project to support native modules.
 *
 * @param {object} packageJSON The project package.json
 * @param {object} configuration The project configuration.
 * @param {string} stage The build stage (preLink or postLink) for which module functions will run.
 */
export function android(
  packageJSON: NPMPackageConfig,
  configuration: Config,
  stage: keyof Module
): void {
  logInfo(`Running module scripts for android for init stage ${stage}`);

  getUsedModules(Object.keys(packageJSON.dependencies || {}), androidModules)
    .forEach(exported => {
      const stageFn = exported[stage];

      return stageFn && typeof stageFn === 'function' && stageFn(configuration);
    });
}

/**
 * Makes modifications to the boilerplate iOS project to support native modules.
 *
 * @param {object} packageJSON The project package.json
 * @param {object} configuration The project configuration.
 * @param {string} stage The build stage (preLink or postLink) for which module functions will run.
 */
export function ios(
  packageJSON: NPMPackageConfig,
  configuration: Config,
  stage: keyof Module
): void {
  logInfo(`Running module scripts for ios for init stage ${stage}`);

  getUsedModules(Object.keys(packageJSON.dependencies || {}), iosModules)
    .forEach(exported => {
      const stageFn = exported[stage];

      return stageFn && typeof stageFn === 'function' && stageFn(configuration);
    });
}
