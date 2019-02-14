import * as fs from './fs';
import * as path from './path';
import {
  Config,
  NPMPackageConfig
} from '../types';
import { satisfies } from 'semver';
import * as helpers from '../helpers';


export enum BuildPlatform {
  android,
  ios,
  web
}
export enum BuildStage {
  beforeCopyBoilerplate,
  beforeLink,
  beforeIOSPodInstall,
  afterLink,
  failed
}
interface Package {
  packageName: string | RegExp;
  version?: string;
}
export interface BuildStageScript {
  name: string;
  script: (config: Config) => void;
  buildStage: BuildStage;
  platforms?: BuildPlatform[];
  packages?: Package[];
  priority?: number;
}

const hookDirectories =
  [path.resolve(__dirname, 'buildStageScripts'), path.resolve('./buildStageScripts')]
    .filter(fs.pathExistsSync);
const hookFileExtension = '.js';

// Loads all the .js files from the `modules` directory and creates a dictionary of filename to
// the exported object from that file
const loadedHooks: BuildStageScript[] = [];

export function load(
  packageJSON: NPMPackageConfig, android: boolean, ios: boolean, web: boolean): void {
  const platforms: BuildPlatform[] = [];
  if (android) {
    platforms.push(BuildPlatform.android);
  }
  if (ios) {
    platforms.push(BuildPlatform.ios);
  }
  if (web) {
    platforms.push(BuildPlatform.web);
  }
  const dependencies = packageJSON.dependencies || {};
  const dependencyKeys = Object.keys(dependencies);
  hookDirectories.map(directory => {
    fs.readdirSync(directory)
      .filter((filename: string) => hookFileExtension === path.extname(filename))
      .forEach((filename: string) => {
        const src = path.resolve(directory, filename);
        const hooks: BuildStageScript[] = require(src);

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

export function run(configuration: Config, buildStage: BuildStage): void {
  loadedHooks.filter(hook => hook.buildStage === buildStage)
    .sort((a, b) => (a.priority || 0) - (b.priority || 0))
    .map(hook => {
      helpers.logInfo(`Running build hook script '${hook.name}'`);
      hook.script(configuration);
    });
}
