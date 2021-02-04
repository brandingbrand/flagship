 // tslint:disable-next-line:ter-max-len
const execFileSync = require('child_process').execFileSync;

import { Config } from '../types';
import * as fs from './fs';
import * as helpers from '../helpers';
import * as path from './path';
import * as versionLib from './version';
import * as nativeConstants from './native-constants';
import * as xcode from 'xcode';
import * as usageDescriptions from './usage-descriptions';

/**
 * Updates app bundle id.
 *
 * @param {object} configuration The project configuration.
 */
export function bundleId(configuration: Config): void {
  if (!configuration.bundleIds) {
    return;
  }

  const bundleId = configuration.bundleIds.ios;

  helpers.logInfo(`updating iOS bundle id`);

  execFileSync('plutil', ['-replace',
    'CFBundleIdentifier',
    '-string',
    bundleId,
    path.ios.infoPlistPath(configuration)]
  );

  fs.replace(
    path.ios.fastfilePath(),
    /.+#PROJECT_MODIFY_FLAG_export_options_export_team_id/g,
    `"${bundleId}" => #PROJECT_MODIFY_FLAG_export_options_export_team_id`
  );
}

/**
 * Enables capabilities for the project.
 *
 * @param {object} configuration The project configuration.
 */
export function capabilities(configuration: Config): void {
  if (configuration.enabledCapabilitiesIOS) {
    helpers.logInfo(`enabling iOS capabilities [${configuration.enabledCapabilitiesIOS}]`);

    configuration.enabledCapabilitiesIOS.forEach(capability => {
      fs.replace(
        path.ios.pbxprojFilePath(configuration),
        new RegExp(`com.apple.${capability}\\s*=\\s*{\\s*enabled = 0;`),
        `com.apple.${capability} = { enabled = 1;`
      );
    });
  }
}

/**
 * Sets the app's targeted build devices
 *
 * @param {object} configuration The project configuration.
 */

export function targetedDevice(configuration: Config): void {
  if (configuration.targetedDevices) {
    helpers.logInfo(`selecting targeted devices: ${configuration.targetedDevices}`);

    const devices: { [key: string]: any } = {
      iPhone: 1,
      iPad: 2,
      Universal: `"1,2"`
    };

    const targetedDeviceRegex = new RegExp(`TARGETED_DEVICE_FAMILY = "1"`, 'g');

    fs.replace(
      path.ios.pbxprojFilePath(configuration),
      targetedDeviceRegex,
      `TARGETED_DEVICE_FAMILY = ${devices[configuration.targetedDevices]}`
    );
  }
}

/**
 * Enables entitlements for the project.
 *
 * @param {object} configuration The project configuration.
 */
export function entitlements(configuration: Config): void {
  if (!configuration.entitlementsFileIOS) {
    return;
  }

  helpers.logInfo(`updating iOS entitlements file`);

  const source = path.project.resolve('env', configuration.entitlementsFileIOS);
  const destination = path.resolve(
    path.ios.nativeProjectPath(configuration),
    `${configuration.name}.entitlements`
  );

  fs.copySync(source, destination);
  fs.replace(
    path.ios.pbxprojFilePath(configuration),
    /CODE_SIGN_IDENTITY = /g,
    `CODE_SIGN_ENTITLEMENTS = ${configuration.name + path.sep + configuration.name}.entitlements;
    CODE_SIGN_IDENTITY = `
  );
}

/**
 * Updates app display name.
 *
 * @param {object} configuration The project configuration.
 */
export function displayName(configuration: Config): void {
  if (!configuration.displayName) {
    return;
  }

  helpers.logInfo(`updating iOS app display name`);
  // tslint:disable-next-line:max-line-length
  execFileSync('plutil', ['-replace',
    'CFBundleDisplayName',
    '-string',
    configuration.displayName,
    path.ios.infoPlistPath(configuration)]
  );
}

/**
 * Sets the app's icon.
 *
 * @param {object} configuration The project configuration.
 */
export function icon(configuration: Config): void {
  if (!configuration || !configuration.appIconDir || !configuration.appIconDir.ios) {
    return;
  }

  helpers.logInfo(`updating iOS app icon`);

  const source = path.resolve(configuration.appIconDir.ios.replace(/\/$/, ''), '.');
  const destination = path.project.resolve(
    'ios',
    configuration.name,
    'Images.xcassets',
    'AppIcon.appiconset'
  );

  try {
    fs.removeSync(destination);
    fs.copySync(source, destination);
  } catch (err) {
    helpers.logError(`updating iOS app icon`, err);
  }
}

/**
 * Sets the app's launch screen.
 *
 * @param {object} configuration The project configuration.
 */
export function launchScreen(configuration: Config): void {
  if (!configuration || !configuration.launchScreen || !configuration.launchScreen.ios) {
    return;
  }

  helpers.logInfo('updating iOS launch screen');

  const sourceImages = configuration.launchScreen.ios.images.replace(/\/$/, '');
  const destinationImages = path.resolve(
    path.ios.nativeProjectPath(configuration),
    'LaunchImages.xcassets'
  );

  const sourceLaunchScreen = configuration.launchScreen.ios.storyboard;
  if (!sourceLaunchScreen) {
    helpers.logError('xib support has been removed. Please include a storyboard file.' +
      ' Using the default Flagship storyboard.');
    return;
  }
  const destinationLaunchScreen = path.resolve(
    path.ios.nativeProjectPath(configuration),
    'LaunchScreen.storyboard'
  );

  try {
    fs.removeSync(destinationImages);
    fs.removeSync(destinationLaunchScreen);

    fs.copySync(sourceImages, destinationImages);
    fs.copySync(sourceLaunchScreen, destinationLaunchScreen);
  } catch (err) {
    helpers.logError('updating iOS launch screen', err);
  }
}

/**
 * Adds exception domains for App Transport Security from the project configuration.
 *
 * @param {object} configuration The project configuration.
 */
export function exceptionDomains(configuration: Config): void {
  const exceptionDomains = configuration.exceptionDomains || [];

  if (exceptionDomains.length) {
    // Users should not add exception domains. They introduce a security vulnerability.
    helpers.logWarn(
      `adding iOS exception domains\n\tYou should not enable exception domains in a production app.`
    );
  }

  if (configuration.disableDevFeature) {
    // remove localhost exception when dev feature is disabled
    fs.replace(
      path.ios.infoPlistPath(configuration),
      // tslint:disable-next-line:ter-max-len
      /<!-- {NSExceptionDomains-localhost-start} -->[.\s\S]+<!-- {NSExceptionDomains-localhost-end} -->/,
      ''
    );
  }

  if (exceptionDomains.length) {
    fs.replace(
      path.ios.infoPlistPath(configuration),
      '<!-- {NSExceptionDomains} -->',
      exceptionDomains
        .map(item => {
          if (typeof item === 'string') {
            return [
              `<key>${item}</key>`,
              '<dict><key>NSExceptionAllowsInsecureHTTPLoads</key><true/></dict>'
            ].join('');
          } else {
            return `<key>${item.domain}</key><dict>${item.value}</dict>`;
          }
        })
        .join('')
    );
  }
}

/**
 * Adds usage description from the project configuration.
 *
 * @param {object} configuration The project configuration.
 */
export function usageDescription(configuration: Config): void {
  if (!configuration.usageDescriptionIOS) {
    return;
  }

  helpers.logInfo(
    `updating iOS usage description: [${configuration.usageDescriptionIOS.map(u => u.key)}]`
  );

  usageDescriptions.add(configuration, configuration.usageDescriptionIOS);
}

/**
 * Adds usage description from the project configuration.
 *
 * @param {object} configuration The project configuration.
 */
export function backgroundModes(configuration: Config): void {
  if (!configuration.UIBackgroundModes) {
    return;
  }

  const infoPlist = path.ios.infoPlistPath(configuration);

  execFileSync('plutil', ['-replace',
    'CFBundleDisplayName',
    '-string',
    configuration.displayName,
    infoPlist]
  );

  const modesArray = configuration.UIBackgroundModes.map(mode => {
    return `"${mode}"`;
  });
  helpers.logInfo(`updating iOS background modes: [${modesArray}]`);

  execFileSync('plutil', ['-replace',
    'UIBackgroundModes',
    '-json',
    modesArray,
    infoPlist]
  );
}

/**
 * Sets the default app URL scheme.
 *
 * @param {object} configuration The project configuration.
 */
export function urlScheme(configuration: Config): void {
  const scheme = (configuration && configuration.urlScheme) || configuration.name.toLowerCase();

  helpers.logInfo(`setting iOS URL scheme to ${scheme}`);

  execFileSync('plutil', ['-replace',
    'default-bb-rn-url-scheme',
    '-string',
    scheme,
    path.ios.infoPlistPath(configuration)]
  );
}

/**
 * Sets the app version number.
 *
 * @param {object} configuration The project configuration.
 * @param {string} newVersion The version number to set.
 */
export function version(configuration: Config, newVersion: string): void {
  const shortVersion = (configuration.ios && configuration.ios.shortVersion)
  || newVersion;

  const bundleVersion = (configuration.ios && configuration.ios.buildVersion)
    || versionLib.normalize(newVersion);

  helpers.logInfo(`setting iOS version number to ${newVersion}`);
  helpers.logInfo(`setting iOS bundle version to ${bundleVersion}`);

  execFileSync('plutil', ['-replace',
    'CFBundleShortVersionString',
    '-string',
    shortVersion,
    path.ios.infoPlistPath(configuration)]
  );

  execFileSync('plutil', ['-replace',
    'CFBundleVersion',
    '-string',
    bundleVersion,
    path.ios.infoPlistPath(configuration)]
  );
}

export function iosExtensions(configuration: Config, version: string): void {
  if (!configuration?.ios?.extensions) {
    return;
  }
  helpers.logInfo(`Adding iOS App Extensions`);
  const bundleVersion = (configuration.ios && configuration.ios.buildVersion)
  || versionLib.normalize(version);
  const extensions = configuration?.ios?.extensions;
  const projectPath = path.ios.pbxprojFilePath(configuration);
  const fastFilePath = path.ios.fastfilePath();
  const teamId = configuration.buildConfig.ios.exportTeamId;
  const appBundleId = configuration.bundleIds.ios;
  for (const extension of extensions) {
    const {
      extensionPath,
      bundleExtensionId,
      provisioningProfileName,
      frameworks,
      entitlements
    } = extension;

    const iosExtensionPath = path.project.resolve('ios', extensionPath);
    const extPlistPath = path.resolve(iosExtensionPath, extension.plistName || 'Info.plist');

    fs.copySync(
      path.project.resolve(extensionPath),
      path.resolve(iosExtensionPath)
    );

    const project = xcode.project(projectPath);
    project.parseSync();

    // Add Groups to projects
    const files = fs.readdirSync(iosExtensionPath).map(file => file);

    const extGroup = project.addPbxGroup(files, extensionPath, iosExtensionPath);
    const groups = project.hash.project.objects.PBXGroup;

    Object.keys(groups).forEach(key => {
      if (groups[key].name === 'CustomTemplate') {
        project.addToPbxGroup(extGroup.uuid, key);
      }
    });

    // Create the target and add it to the build phases
    const target = project.addTarget(
      extensionPath,
      'app_extension',
      extensionPath,
      bundleExtensionId
    );
    project.addBuildPhase([], 'PBXSourcesBuildPhase', 'Sources', target.uuid);
    project.addBuildPhase([], 'PBXFrameworksBuildPhase', 'Frameworks', target.uuid);

    // Add custom frameworks to target
    if (frameworks) {
      addFrameworks(project, frameworks, target.uuid);
    }

    fs.writeFileSync(path.ios.pbxprojFilePath(configuration), project.writeSync());

    // Update Extension Build settings
    fs.replace(
      projectPath,
      new RegExp(`PRODUCT_NAME = "${extensionPath}";`, 'g'),
      `PRODUCT_NAME = "${extensionPath}";
        OTHER_LDFLAGS = ("$(inherited)", "-ObjC", "-lc++");
        CODE_SIGN_ENTITLEMENTS = "${extensionPath}/${entitlements}";
        ENABLE_BITCODE = NO;
        PROVISIONING_PROFILE_SPECIFIER = $EXT_PROFILE;
        DEVELOPMENT_TEAM = ${teamId};
        CODE_SIGN_IDENTITY = "iPhone Distribution";
        EXT_PROFILE = "${provisioningProfileName}";`
    );

    // Fastfile code
    const oldProvisioning =
    `"${appBundleId}" => #PROJECT_MODIFY_FLAG_export_options_export_team_id`;
    const oldProvisioningRegex = new RegExp(oldProvisioning, 'g');
    fs.replace(
      fastFilePath,
      oldProvisioningRegex,
      `"${bundleExtensionId}" => "${provisioningProfileName}",
      "${appBundleId}" => #PROJECT_MODIFY_FLAG_export_options_export_team_id`
    );

    // Update Extension PList

    execFileSync('plutil', ['-replace',
      'CFBundleShortVersionString',
      '-string',
      version,
      extPlistPath]
    );
    execFileSync('plutil', ['-replace',
      'CFBundleVersion',
      '-string',
      bundleVersion,
      extPlistPath]
    );

    // Find and replace and additional strings
    for (const findReplace of extension.additionalFiles || []) {
      const { newText, oldText, paths } = findReplace;
      for (const replacePath of paths) {
        const iosRelativePath = path.project.resolve('ios', replacePath);
        fs.replace(iosRelativePath, oldText, newText);
      }
    }
  }
}

/**
 * @param {object} project XCode Project
 * @param {string[]} frameworks Frameworks to add
 * @param {string} uuid Target uuid
 */
function addFrameworks(project: xcode.XCodeproject, frameworks: string[], uuid: string): void {
  for (const framework of frameworks || []) {
    project.addFramework(framework, { target: uuid, customFramework: true, embed: true});
  }
}

/**
 * Copy custom sentry properties file to ios directory
 *
 * @param {object} configuration The project configuration.
 */
export function sentryProperties(configuration: Config): void {
  if (!configuration || !configuration.sentry || !configuration.sentry.propertiesPath) {
    return;
  }

  helpers.logInfo(`updating iOS Sentry properties`);

  const source = path.resolve(configuration.sentry.propertiesPath.replace(/\/$/, ''), '.');
  const destination = path.project.resolve('ios', 'sentry.properties');

  try {
    fs.removeSync(destination);
    fs.copySync(source, destination);
  } catch (err) {
    helpers.logError(`updating iOS Sentry properties`, err);
  }
}

/**
 * Adds ShowDevMenu:"true" to NativeConstants for showing the dev menu
 * @param {object} configuration The project configuration.
 */
export function addDevMenuFlag(configuration: Config): void {
  nativeConstants.addIOS(configuration, 'ShowDevMenu', 'true');
}

/**
 * Sets initial env in EnvSwitcher
 * @param {object} configuration The project configuration.
 * @param {string} env The identifier for the environment for which to return the configuration.
 */
export function setEnvSwitcherInitialEnv(configuration: Config, env: string): void {
  helpers.logInfo(`setting initial env in EnvSwitcher for IOS`);

  const envSwitcherPath = path.resolve(path.ios.nativeProjectPath(configuration), 'EnvSwitcher.m');

  fs.replace(
    envSwitcherPath,
    /@"\w*";\s*\/\/\s*\[EnvSwitcher initialEnvName\]/,
    `@"${env}"; // [EnvSwitcher initialEnvName]`
  );
}
