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
  packageName: string | RegExp;
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
  const dependencyKeys = Object.keys(dependencies);
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
              let version: string | undefined;
              if (typeof pkg.packageName === 'string') {
                // string package name
                version = dependencies[pkg.packageName];
              } else {
                // regex package name
                version = dependencyKeys.find(key => (pkg.packageName as RegExp).test(key));
              }
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
