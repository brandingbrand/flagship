import * as fs from './fs';
import * as path from './path';
import { Config,
  NPMPackageConfig
} from '../types';
const kModulesDirectory = path.resolve(__dirname, 'modules');
const kModuleFileExtension = '.js';

export interface Module {
  ios: (config: Config) => void;
  android: (config: Config) => void;
}

export interface ModuleList {
  [k: string]: Module;
}

// Loads all the .js files from the `modules` directory and creates a dictionary of filename to
// the exported object from that file
const noModules: ModuleList = {};
const kSupportedModules: ModuleList = fs.readdirSync(kModulesDirectory)
  .filter((filename: string) => kModuleFileExtension === path.extname(filename))
  .reduce((map: ModuleList, filename: string) => {
    const name = path.basename(filename, kModuleFileExtension);
    const src = path.resolve(kModulesDirectory, filename);

    map[name] = require(src);

    return map;
  }, noModules);

/**
 * Looks through an array of dependencies and returns an array of module modifications which
 * must be executed.
 *
 * @param {string[]} dependencies An array of dependencies to filter.
 * @returns {string[]} An array of module modification scripts which must be executed for the
 * given set of dependencies.
 */
function getUsedModules(dependencies: string[]): Module[] {
  // Remove the private scope from the package name before checking for a module patcher
  // e.g. `@brandingbrand/react-native-zendesk-chat` becomes `react-native-zendesk-chat`
  return dependencies
    .map(dependency => {
      const [scopeOrModule, module] = dependency.split('/');
      return kSupportedModules[module || scopeOrModule];
    })
    .filter(Boolean);
}

/**
 * Makes modifications to the boilerplate Android project to support native modules.
 *
 * @param {object} packageJSON The project package.json
 * @param {object} configuration The project configuration.
 */
export function android(packageJSON: NPMPackageConfig, configuration: Config): void {
  getUsedModules(Object.keys(packageJSON.dependencies || {}))
    .forEach(modifier => {
      return modifier.android &&
        'function' === typeof modifier.android &&
        modifier.android(configuration);
    });
}

/**
 * Makes modifications to the boilerplate iOS project to support native modules.
 *
 * @param {object} packageJSON The project package.json
 * @param {object} configuration The project configuration.
 */
export function ios(packageJSON: NPMPackageConfig, configuration: Config): void {
  getUsedModules(Object.keys(packageJSON.dependencies || {}))
    .forEach(modifier => {
      return modifier.ios &&
        'function' === typeof modifier.ios &&
        modifier.ios(configuration);
    });
}
