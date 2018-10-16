import * as android from '../lib/android';
import * as cocoapods from '../lib/cocoapods';
import * as deeplinking from '../lib/deeplinking';
import * as env from '../lib/env';
import * as fastlane from '../lib/fastlane';
import * as fs from '../lib/fs';
import * as ios from '../lib/ios';
import * as link from '../lib/link';
import * as helpers from '../helpers';
import * as modules from '../lib/modules';
import * as path from '../lib/path';
import * as rename from '../lib/rename';
import * as web from '../lib/web';
import * as os from '../lib/os';
import {
  Config,
  NPMPackageConfig
} from '../types';

export interface BuilderArgs {
  option: (
    a: string,
    b: {
      alias: string;
      default: string;
    }) => void;
}

export interface HandlerArgs {
  platform: string;
  env: string;
}

export const command = 'init [platform]';

export const describe = 'initialize FLAGSHIP for [platform]';

export function builder(yargs: BuilderArgs): void {
  yargs.option('env', {
    alias: 'e',
    default: 'prod'
  });
}

// tslint:disable-next-line:cyclomatic-complexity
export function handler(argv: HandlerArgs): void {
  const platform = argv.platform;
  const doAndroid = !platform || platform === 'android' || platform === 'native';
  const doIOS = (!platform || platform === 'ios' || platform === 'native') && !os.win;
  const doWeb = !platform || platform === 'web';

  if (!doAndroid && !doIOS && !doWeb) {
    helpers.logError(`unrecognized platform ${platform}`);
    return process.exit(1);
  }

  helpers.logInfo(`Flagship ${platform} init`);

  const projectPackageJSON = require(path.project.resolve('package.json'));
  const configuration = initEnvironment(argv.env, projectPackageJSON);

  if (doAndroid) {
    initAndroid(projectPackageJSON, configuration, projectPackageJSON.version, argv.env);
  }

  if (doIOS) {
    initIOS(projectPackageJSON, configuration, projectPackageJSON.version, argv.env);
  }

  if (doWeb) {
    initWeb(projectPackageJSON, configuration, argv.env);
  }

  // Run react-native link
  link
    .link(configuration)
    .then(() => {
      if (doAndroid) {
        modules.android(projectPackageJSON, configuration);
      }

      if (doIOS) {
        cocoapods.install();
        modules.ios(projectPackageJSON, configuration);
      }
    })
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}

/**
 * Initializes common features across all platforms.
 *
 * @param {string} environmentIdentifier The environment identifier for which to initialize.
 * @param {object} packageJSON The project's package.json.
 * @returns {object} The project configuration.
 */
function initEnvironment(
  environmentIdentifier: string,
  packageJSON: NPMPackageConfig
): Config {
  const configuration = env.configuration(environmentIdentifier, packageJSON);

  env.write(configuration); // Replace env.js with the current environment
  env.createEnvIndex();

  return configuration;
}

/**
 * Initializes the Android app.
 *
 * @param {object} packageJSON The project's package.json.
 * @param {object} configuration The project configuration.
 * @param {string} version The app version number to initialize.
 * @param {string} environmentIdentifier The environment identifier for which to initialize.
 */
function initAndroid(
  packageJSON: NPMPackageConfig,
  configuration: Config,
  version: string,
  environmentIdentifier: string
): void {
  helpers.logInfo('beginning Android initialization');

  // Clone the boilerplate into the project
  fs.clone('android');

  // Rename the boilerplate project with the app name
  rename.source('FLAGSHIP', configuration.name, 'android');
  rename.files('FLAGSHIP', configuration.name, 'android');

  fastlane.configure(path.android.fastfilePath(), configuration); // Update Fastfile

  android.urlScheme(configuration); // Add deep link schemes
  deeplinking.addDeeplinkHosts(configuration.associatedDomains);

  android.displayName(configuration); // Update the app display name
  android.bundleId(configuration); // Update the app bundle id
  android.icon(configuration); // Update app icon
  android.launchScreen(configuration); // Update app launch screen
  android.version(version); // Sync app version
  android.sentryProperties(configuration);
  android.setEnvSwitcherInitialEnv(configuration, environmentIdentifier);

  // Android specific configuration
  android.googleMaps(configuration);

  if (!configuration.disableDevFeature) {
    android.addDevMenuFlag(configuration);
  }

  helpers.logInfo('finished Android initialization');
}

/**
 * Initializes the iOS app.
 *
 * @param {object} packageJSON The project's package.json.
 * @param {object} configuration The project configuration.
 * @param {string} version The app version number to initialize.
 * @param {string} environmentIdentifier The environment identifier for which to initialize.
 */
function initIOS(
  packageJSON: NPMPackageConfig,
  configuration: Config,
  version: string,
  environmentIdentifier: string
): void {
  helpers.logInfo('beginning iOS initialization');

  // Clone the boilerplate into the project
  fs.clone('ios');

  // Rename the boilerplate project with the app name
  rename.source('FLAGSHIP', configuration.name, 'ios');
  rename.files('FLAGSHIP', configuration.name, 'ios');

  fastlane.configure(path.ios.fastfilePath(), configuration); // Update Fastfile

  ios.urlScheme(configuration); // Add deep link schemes
  ios.displayName(configuration); // Update the app display name
  ios.bundleId(configuration); // Update the app bundle id
  ios.icon(configuration); // Update app icon
  ios.launchScreen(configuration); // Update app launch screen
  ios.version(configuration, version); // Sync app version

  // iOS Specific configuration
  ios.exceptionDomains(configuration); // Add ATS exception domains for iOS
  ios.capabilities(configuration); // Add app capabilities
  ios.targetedDevice(configuration); // Set targeted device
  ios.entitlements(configuration); // Add app entitlements
  ios.usageDescription(configuration); // Add usage descriptions
  ios.sentryProperties(configuration);
  ios.setEnvSwitcherInitialEnv(configuration, environmentIdentifier);
  if (configuration.ios) {
    if (configuration.ios.pods) {
      cocoapods.sources(configuration.ios.pods.sources);
    }
  }

  if (!configuration.disableDevFeature) {
    ios.addDevMenuFlag(configuration);
  }

  helpers.logInfo('finished iOS initialization');
}

/**
 * Initializes the web app.
 *
 * @param {object} packageJSON The project's package.json.
 * @param {object} configuration The web configuration object.
 * @param {string} environmentIdentifier The environment identifier for which to initialize.
 */
function initWeb(
  packageJSON: NPMPackageConfig,
  configuration: Config,
  environmentIdentifier: string
): void {
  helpers.logInfo('beginning Web initialization');

  fs.copySync(
    path.flagship.resolve('../fsweb'), // only works in the monorepo
    path.project.resolve('web')
  );

  web.homepage(configuration.webPath || '/');
  web.title(configuration.webTitle);
  web.headerScripts(configuration.webScriptInjectHeader);
  web.footerScripts(configuration.webScriptInjectFooter);

  web.install();
  web.link(packageJSON);

  helpers.logInfo('finished Web initialization');
}
