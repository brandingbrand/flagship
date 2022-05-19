import * as xcode from 'xcode';

import * as helpers from '../helpers';
import type { Config } from '../types';

import * as fs from './fs';
import * as nativeConstants from './native-constants';
import * as path from './path';
import * as usageDescriptions from './usage-descriptions';
import * as versionLib from './version';

/**
 * Updates app bundle id.
 *
 * @param configuration The project configuration.
 */
export const bundleId = (configuration: Config): void => {
  if (!configuration.bundleIds) {
    return;
  }

  const bundleId = configuration.bundleIds.ios;

  helpers.logInfo(`updating iOS bundle id`);

  fs.update(
    path.ios.infoPlistPath(configuration),
    /<key>CFBundleIdentifier<\/key>\s+<string>[^<]+<\/string>/,
    `<key>CFBundleIdentifier</key><string>${bundleId}</string>`
  );
  fs.update(
    path.ios.fastfilePath(),
    /.+#PROJECT_MODIFY_FLAG_export_options_export_team_id/g,
    `"${bundleId}" => #PROJECT_MODIFY_FLAG_export_options_export_team_id`
  );
};

/**
 * Enables capabilities for the project.
 *
 * @param configuration The project configuration.
 */
export const capabilities = (configuration: Config): void => {
  if (configuration.enabledCapabilitiesIOS) {
    helpers.logInfo(`enabling iOS capabilities [${configuration.enabledCapabilitiesIOS}]`);

    for (const capability of configuration.enabledCapabilitiesIOS) {
      fs.update(
        path.ios.pbxprojFilePath(configuration),
        new RegExp(`com.apple.${capability}\\s*=\\s*{\\s*enabled = 0;`),
        `com.apple.${capability} = { enabled = 1;`
      );
    }
  }
};

/**
 * Sets the app's targeted build devices
 *
 * @param configuration The project configuration.
 */
export const targetedDevice = (configuration: Config): void => {
  if (configuration.targetedDevices) {
    helpers.logInfo(`selecting targeted devices: ${configuration.targetedDevices}`);

    const devices: Record<string, unknown> = {
      iPhone: 1,
      iPad: 2,
      Universal: `"1,2"`,
    };

    const targetedDeviceRegex = new RegExp(`TARGETED_DEVICE_FAMILY = "1"`, 'g');

    fs.update(
      path.ios.pbxprojFilePath(configuration),
      targetedDeviceRegex,
      `TARGETED_DEVICE_FAMILY = ${devices[configuration.targetedDevices]}`
    );
  }
};

/**
 * Enables entitlements for the project.
 *
 * @param configuration The project configuration.
 */
export const entitlements = (configuration: Config): void => {
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
  fs.update(
    path.ios.pbxprojFilePath(configuration),
    /CODE_SIGN_IDENTITY = /g,
    `CODE_SIGN_ENTITLEMENTS = ${configuration.name + path.sep + configuration.name}.entitlements;
    CODE_SIGN_IDENTITY = `
  );
};

/**
 * Updates app display name.
 *
 * @param configuration The project configuration.
 */
export const displayName = (configuration: Config): void => {
  if (!configuration.displayName) {
    return;
  }

  helpers.logInfo(`updating iOS app display name`);

  fs.update(
    path.ios.infoPlistPath(configuration),
    /<key>CFBundleDisplayName<\/key>\s+<string>\w+<\/string>/,
    `<key>CFBundleDisplayName</key><string>${configuration.displayName}</string>`
  );
};

/**
 * Sets the app's icon.
 *
 * @param configuration The project configuration.
 */
export const icon = (configuration: Config): void => {
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
  } catch (error: any) {
    helpers.logError(`updating iOS app icon`, error);
  }
};

/**
 * Sets the app's launch screen.
 *
 * @param configuration The project configuration.
 */
export const launchScreen = (configuration: Config): void => {
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
    helpers.logError(
      'xib support has been removed. Please include a storyboard file.' +
        ' Using the default Flagship storyboard.'
    );
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
  } catch (error: any) {
    helpers.logError('updating iOS launch screen', error);
  }
};

/**
 * Adds exception domains for App Transport Security from the project configuration.
 *
 * @param configuration The project configuration.
 */
export const exceptionDomains = (configuration: Config): void => {
  const exceptionDomains = configuration.exceptionDomains || [];

  if (exceptionDomains.length > 0) {
    // Users should not add exception domains. They introduce a security vulnerability.
    helpers.logWarn(
      `adding iOS exception domains\n\tYou should not enable exception domains in a production app.`
    );
  }

  if (configuration.disableDevFeature) {
    // remove localhost exception when dev feature is disabled
    fs.update(
      path.ios.infoPlistPath(configuration),
      /<!-- {NSExceptionDomains-localhost-start} -->[\S\s]+<!-- {NSExceptionDomains-localhost-end} -->/,
      ''
    );
  }

  if (exceptionDomains.length > 0) {
    fs.update(
      path.ios.infoPlistPath(configuration),
      '<!-- {NSExceptionDomains} -->',
      exceptionDomains
        .map((item) => {
          if (typeof item === 'string') {
            return [
              `<key>${item}</key>`,
              '<dict><key>NSExceptionAllowsInsecureHTTPLoads</key><true/></dict>',
            ].join('');
          }
          return `<key>${item.domain}</key><dict>${item.value}</dict>`;
        })
        .join('')
    );
  }
};

/**
 * Adds usage description from the project configuration.
 *
 * @param configuration The project configuration.
 */
export const usageDescription = (configuration: Config): void => {
  if (!configuration.usageDescriptionIOS) {
    return;
  }

  helpers.logInfo(
    `updating iOS usage description: [${configuration.usageDescriptionIOS.map((u) => u.key)}]`
  );

  usageDescriptions.add(configuration, configuration.usageDescriptionIOS);
};

/**
 * Adds usage description from the project configuration.
 *
 * @param configuration The project configuration.
 */
export const backgroundModes = (configuration: Config): void => {
  if (!configuration.UIBackgroundModes) {
    return;
  }

  helpers.logInfo(
    `updating iOS background modes: [${configuration.UIBackgroundModes.map((u) => u.string)}]`
  );

  const infoPlist = path.ios.infoPlistPath(configuration);

  fs.update(
    infoPlist,
    '<key>UIRequiredDeviceCapabilities</key>',
    `<key>UIBackgroundModes</key>
      <array>
      ${configuration.UIBackgroundModes.map((mode) => `<string>${mode.string}</string>`)}
      </array>
    <key>UIRequiredDeviceCapabilities</key>`
  );
};

/**
 * Sets the default app URL scheme.
 *
 * @param configuration The project configuration.
 */
export const urlScheme = (configuration: Config): void => {
  const scheme = (configuration && configuration.urlScheme) || configuration.name.toLowerCase();

  helpers.logInfo(`setting iOS URL scheme to ${scheme}`);

  fs.update(path.ios.infoPlistPath(configuration), 'default-bb-rn-url-scheme', scheme);
};

/**
 * Sets the app version number.
 *
 * @param configuration The project configuration.
 * @param newVersion The version number to set.
 */
export const version = (configuration: Config, newVersion: string): void => {
  const shortVersion = (configuration.ios && configuration.ios.shortVersion) || newVersion;

  const bundleVersion =
    (configuration.ios && configuration.ios.buildVersion) || versionLib.normalize(newVersion);

  helpers.logInfo(`setting iOS version number to ${newVersion}`);
  helpers.logInfo(`setting iOS bundle version to ${bundleVersion}`);

  fs.update(
    path.ios.infoPlistPath(configuration),
    /<key>CFBundleShortVersionString<\/key>\s+<string>[\d.]+<\/string>/,
    `<key>CFBundleShortVersionString</key>\n\t<string>${shortVersion}</string>`
  );

  fs.update(
    path.ios.infoPlistPath(configuration),
    /<key>CFBundleVersion<\/key>\s+<string>[\d.]+<\/string>/,
    `<key>CFBundleVersion</key>\n\t<string>${bundleVersion}</string>`
  );
};

// eslint-disable-next-line max-statements
export const iosExtensions = (configuration: Config, version: string): void => {
  if (!configuration.ios?.extensions) {
    return;
  }
  helpers.logInfo(`Adding iOS App Extensions`);
  const shortVersion = (configuration.ios && configuration.ios.shortVersion) || version;
  const bundleVersion =
    (configuration.ios && configuration.ios.buildVersion) || versionLib.normalize(version);
  const { extensions } = configuration.ios;
  const projectPath = path.ios.pbxprojFilePath(configuration);
  const fastFilePath = path.ios.fastfilePath();
  const teamId = configuration.buildConfig.ios.exportTeamId;
  const appBundleId = configuration.bundleIds.ios;
  for (const extension of extensions) {
    const { bundleExtensionId, entitlements, extensionPath, frameworks, provisioningProfileName } =
      extension;

    const iosExtensionPath = path.project.resolve('ios', extensionPath);
    const extPlistPath = path.resolve(iosExtensionPath, extension.plistName || 'Info.plist');

    fs.copySync(path.project.resolve(extensionPath), path.resolve(iosExtensionPath));

    const project = xcode.project(projectPath);
    project.parseSync();

    // Add Groups to projects
    const files = fs.readdirSync(iosExtensionPath).map((file) => file);

    const extGroup = project.addPbxGroup(files, extensionPath, iosExtensionPath);
    const groups = project.hash.project.objects.PBXGroup;

    for (const key of Object.keys(groups ?? {})) {
      if (groups?.[key]?.name === 'CustomTemplate') {
        project.addToPbxGroup(extGroup.uuid, key);
      }
    }

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
    fs.update(
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
    const oldProvisioning = `"${appBundleId}" => #PROJECT_MODIFY_FLAG_export_options_export_team_id`;
    const oldProvisioningRegex = new RegExp(oldProvisioning, 'g');
    fs.update(
      fastFilePath,
      oldProvisioningRegex,
      `"${bundleExtensionId}" => "${provisioningProfileName}",
      "${appBundleId}" => #PROJECT_MODIFY_FLAG_export_options_export_team_id`
    );

    // Update Extension PList
    fs.update(
      extPlistPath,
      /<key>CFBundleShortVersionString<\/key>\s+<string>\S+<\/string>/,
      `<key>CFBundleShortVersionString</key>\n\t<string>${shortVersion}</string>`
    );
    fs.update(
      extPlistPath,
      /<key>CFBundleVersion<\/key>\s+<string>\S+<\/string>/,
      `<key>CFBundleVersion</key>\n\t<string>${bundleVersion}</string>`
    );

    // Find and replace and additional strings
    for (const findReplace of extension.additionalFiles || []) {
      const { newText, oldText, paths } = findReplace;
      for (const replacePath of paths) {
        const iosRelativePath = path.project.resolve('ios', replacePath);
        fs.update(iosRelativePath, oldText, newText);
      }
    }
  }
};

/**
 * @param project XCode Project
 * @param frameworks Frameworks to add
 * @param uuid Target uuid
 */
const addFrameworks = (project: xcode.XCodeproject, frameworks: string[], uuid: string): void => {
  for (const framework of frameworks || []) {
    project.addFramework(framework, { target: uuid, customFramework: true, embed: true });
  }
};

/**
 * Copy custom sentry properties file to ios directory
 *
 * @param configuration The project configuration.
 */
export const sentryProperties = (configuration: Config): void => {
  if (!configuration || !configuration.sentry || !configuration.sentry.propertiesPath) {
    return;
  }

  helpers.logInfo(`updating iOS Sentry properties`);

  const source = path.resolve(configuration.sentry.propertiesPath.replace(/\/$/, ''), '.');
  const destination = path.project.resolve('ios', 'sentry.properties');

  try {
    fs.removeSync(destination);
    fs.copySync(source, destination);
  } catch (error: any) {
    helpers.logError(`updating iOS Sentry properties`, error);
  }
};

/**
 * Adds ShowDevMenu:"true" to NativeConstants for showing the dev menu
 *
 * @param configuration The project configuration.
 */
export const addDevMenuFlag = (configuration: Config): void => {
  nativeConstants.addIOS(configuration, 'ShowDevMenu', 'true');
};

/**
 * Sets initial env in EnvSwitcher
 *
 * @param configuration The project configuration.
 * @param env The identifier for the environment for which to return the configuration.
 */
export const setEnvSwitcherInitialEnv = (configuration: Config, env: string): void => {
  helpers.logInfo(`setting initial env in EnvSwitcher for IOS`);

  const envSwitcherPath = path.resolve(path.ios.nativeProjectPath(configuration), 'EnvSwitcher.m');

  fs.update(
    envSwitcherPath,
    /@"\w*";\s*\/\/\s*\[EnvSwitcher initialEnvName]/,
    `@"${env}"; // [EnvSwitcher initialEnvName]`
  );
};

/**
 * Adds iOS system and custom frameworks to project
 *
 * @param configuration The project configuration.
 */
export const frameworks = (configuration: Config): void => {
  const projectPath = path.ios.pbxprojFilePath(configuration);
  const project = xcode.project(projectPath);
  project.parseSync();

  if (configuration.ios?.frameworks) {
    for (const obj of configuration.ios.frameworks) {
      const { framework, frameworkPath } = obj;
      if (frameworkPath) {
        const source = path.resolve(path.project.path(), frameworkPath, framework);
        const destination = path.resolve(path.project.path(), 'ios', framework);
        fs.copySync(source, destination);

        project.addFramework(destination, { customFramework: true });
      } else {
        project.addFramework(framework, {});
      }
    }
  }

  fs.writeFileSync(projectPath, project.writeSync());
};
