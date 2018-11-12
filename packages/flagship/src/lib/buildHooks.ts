import * as fs from './fs';
import * as path from './path';
import {
  Config,
  NPMPackageConfig
} from '../types';
import { satisfies } from 'semver';
import * as helpers from '../helpers';


type Platform = 'android' | 'ios' | 'web';
type LifeCycle = 'beforeCopyBoilerplate' | 'beforeLink' |
  'beforeIOSPodInstall' | 'afterLink' | 'failed';
interface Package {
  packageName: string;
  version?: string;
}
export interface BuildHook {
  name: string;
  script: (config: Config) => void;
  lifeCycle: LifeCycle;
  platforms?: Platform[];
  packages?: Package[];
  priority?: number;
}

const hookDirectories =
  [path.resolve(__dirname, 'buildHooks'), path.resolve('./buildHooks')].filter(fs.pathExistsSync);
const hookFileExtension = '.js';

// Loads all the .js files from the `modules` directory and creates a dictionary of filename to
// the exported object from that file
const loadedHooks: BuildHook[] = [];

export function load(
  packageJSON: NPMPackageConfig, android: boolean, ios: boolean, web: boolean): void {
  const platforms: Platform[] = [];
  if (android) {
    platforms.push('android');
  }
  if (ios) {
    platforms.push('ios');
  }
  if (web) {
    platforms.push('web');
  }
  const dependencies = packageJSON.dependencies || {};
  hookDirectories.map(directory => {
    fs.readdirSync(directory)
      .filter((filename: string) => hookFileExtension === path.extname(filename))
      .forEach((filename: string) => {
        const src = path.resolve(directory, filename);
        const hooks: BuildHook[] = require(src);

        hooks.forEach(hook => {
          if (hook.platforms) {
            // If 'platforms' condition is given, check if it matches any of current platforms
            const match = hook.platforms.find(platform => platforms.indexOf(platform) >= 0);
            if (!match) {
              return;
            }
          }

          if (hook.packages) {
            // If 'packages' condition is given, check if at least one package is in the
            // dependencies list with no version specified or version in range
            const match = hook.packages.find(pkg => {
              const version = dependencies[pkg.packageName];
              return (!!version && (!pkg.version || satisfies(version, pkg.version)));
            });
            if (!match) {
              return;
            }
          }
          loadedHooks.push(hook);
        });
      });
  });
}

export function run(configuration: Config, lifeCycle: LifeCycle): void {
  loadedHooks.filter(hook => hook.lifeCycle === lifeCycle)
    .sort((a, b) => (a.priority || 0) - (b.priority || 0))
    .map(hook => {
      helpers.logInfo(`Running build hook script '${hook.name}'`);
      hook.script(configuration);
    });
}

// /**
//  * Looks through an array of dependencies and returns an array of module modifications which
//  * must be executed.
//  *
//  * @param {string[]} dependencies An array of dependencies to filter.
//  * @returns {string[]} An array of module modification scripts which must be executed for the
//  * given set of dependencies.
//  */
// function getUsedModules(dependencies: string[]): Module[] {
//   // Remove the private scope from the package name before checking for a module patcher
//   // e.g. `@brandingbrand/react-native-zendesk-chat` becomes `react-native-zendesk-chat`
//   return dependencies
//     .map(dependency => {
//       const [scopeOrModule, module] = dependency.split('/');
//       return kSupportedModules[module || scopeOrModule];
//     })
//     .filter(Boolean);
// }

// /**
//  * Makes modifications to the boilerplate Android project to support native modules.
//  *
//  * @param {object} packageJSON The project package.json
//  * @param {object} configuration The project configuration.
//  */
// export function android(packageJSON: NPMPackageConfig, configuration: Config): void {
//   getUsedModules(Object.keys(packageJSON.dependencies || {}))
//     .forEach(modifier => {
//       return modifier.android &&
//         'function' === typeof modifier.android &&
//         modifier.android(configuration);
//     });
// }

// /**
//  * Makes modifications to the boilerplate iOS project to support native modules.
//  *
//  * @param {object} packageJSON The project package.json
//  * @param {object} configuration The project configuration.
//  */
// export function ios(packageJSON: NPMPackageConfig, configuration: Config): void {
//   getUsedModules(Object.keys(packageJSON.dependencies || {}))
//     .forEach(modifier => {
//       return modifier.ios &&
//         'function' === typeof modifier.ios &&
//         modifier.ios(configuration);
//     });
// }
