import * as fs from './fs';
import * as path from './path';
import * as helpers from '../helpers';
import * as versionLib from './version';
import * as nativeConstants from './native-constants';
import * as FlagshipTypes from '../types';

const kDefaultGoogleMapsAPIKey = '_FlagshipGoogleMapsAPIKey_';

/**
 * Updates app bundle id.
 *
 * @param {object} configuration The project configuration.
 */
export function bundleId(configuration: FlagshipTypes.Config): void {
  if (!configuration.bundleIds || !configuration.bundleIds.android) {
    return;
  }

  helpers.logInfo('updating Android bundle id');

  fs.update(
    path.android.gradlePath(),
    /applicationId\s+".+"/,
    `applicationId "${configuration.bundleIds.android}"`
  );
}

/**
 * Updates app display name.
 *
 * @param {object} configuration The project configuration.
 */
export function displayName(configuration: FlagshipTypes.Config): void {
  if (!configuration.displayName) {
    return;
  }

  helpers.logInfo(`updating Android app display name`);

  fs.update(
    path.android.stringsPath(),
    /<string name="app_name">[^<]+<\/string>/,
    `<string name="app_name">${configuration.displayName}</string>`
  );
}

/**
 * Updates the Google Maps API key.
 *
 * @param {object} configuration The project configuration.
 */
export function googleMaps(configuration: FlagshipTypes.Config): void {
  if (!configuration.googleMapApiKey) {
    return;
  }

  helpers.logInfo(`updating Google Maps API key`);

  fs.update(path.android.manifestPath(), kDefaultGoogleMapsAPIKey, configuration.googleMapApiKey);
}

/**
 * Sets the app's icon.
 *
 * @param {object} configuration The project configuration.
 */
export function icon(configuration: FlagshipTypes.Config): void {
  if (!configuration || !configuration.appIconDir || !configuration.appIconDir.android) {
    return;
  }

  helpers.logInfo(`updating Android app icon`);

  const source = path.project.resolve(configuration.appIconDir.android.replace(/\/$/, ''), '.');

  try {
    fs.copySync(source, path.android.resourcesPath());
  } catch (err) {
    helpers.logError(`updating Android app icon`, err);

    process.exit(1);
  }
}

/**
 * Sets the app's launch screen.
 *
 * @param {object} configuration The project configuration.
 */
export function launchScreen(configuration: FlagshipTypes.Config): void {
  if (!configuration || !configuration.launchScreen || !configuration.launchScreen.android) {
    return;
  }

  helpers.logInfo('updating Android launch screen');

  const source = path.resolve(configuration.launchScreen.android.replace(/\/$/, ''), '.');

  try {
    fs.copySync(source, path.android.resourcesPath());
  } catch (err) {
    helpers.logError('updating Android launch screen', err);

    process.exit(1);
  }
}

/**
 * Sets the app version number.
 *
 * @param {string} newVersion The version number to set.
 */
export function version(newVersion: string): void {
  helpers.logInfo(`setting Android version number to ${newVersion}`);

  fs.update(
    path.android.gradlePropertiesPath(),
    /VERSION_NAME=[\d\.]+/,
    `VERSION_NAME=${newVersion}`
  );

  fs.update(
    path.android.gradlePropertiesPath(),
    /VERSION_CODE_SHORT=\d+/,
    `VERSION_CODE_SHORT=${versionLib.normalize(newVersion)}`
  );
}

/**
 * Sets the default app URL scheme.
 *
 * @param {object} configuration The project configuration.
 */
export function urlScheme(configuration: FlagshipTypes.Config): void {
  const scheme = (configuration && configuration.urlScheme) || configuration.name.toLowerCase();

  helpers.logInfo(`setting Android URL scheme to ${scheme}`);

  fs.update(path.android.manifestPath(), /default-bb-rn-url-scheme/g, scheme);
}

/**
 * Copy custom sentry properties file to android directory
 *
 * @param {object} configuration The project configuration.
 */
export function sentryProperties(configuration: FlagshipTypes.Config): void {
  if (!configuration || !configuration.sentry || !configuration.sentry.propertiesPath) {
    return;
  }

  helpers.logInfo(`updating Android Sentry properties`);

  const source = path.resolve(configuration.sentry.propertiesPath.replace(/\/$/, ''), '.');
  const destination = path.project.resolve('android', 'sentry.properties');

  try {
    fs.removeSync(destination);
    fs.copySync(source, destination);
  } catch (err) {
    helpers.logError(`updating Android Sentry properties`, err);

    process.exit(1);
  }
}

/**
 * Adds ShowDevMenu:"true" to NativeConstants for showing the dev menu
 * @param {object} configuration The project configuration.
 */
export function addDevMenuFlag(configuration: FlagshipTypes.Config): void {
  nativeConstants.addAndroid(configuration, 'ShowDevMenu', 'true');
}

/**
 * Sets initial env in EnvSwitcher
 * @param {object} configuration The project environment configuration.
 * @param {string} env The identifier for the environment for which to return the configuration.
 */
export function setEnvSwitcherInitialEnv(configuration: FlagshipTypes.Config, env: string): void {
  helpers.logInfo(`setting initial env in EnvSwitcher for Android`);

  const envSwitcherPath = path.resolve(
    path.android.nativeProjectPath(configuration),
    'EnvSwitcher.java'
  );
  fs.update(
    envSwitcherPath,
    /"\w*";\s*\/\/\s*\[EnvSwitcher initialEnvName\]/,
    `"${env}"; // [EnvSwitcher initialEnvName]`
  );
}

/**
 * Adds exception domains for Network Security Config from the project configuration.
 *
 * @param {object} configuration The project configuration.
 */
export function exceptionDomains(configuration: FlagshipTypes.Config): void {
  const { exceptionDomains = [] } = configuration;

  if (Array.isArray(exceptionDomains) && exceptionDomains.length > 0) {
    // Users should not add exception domains. They introduce a security vulnerability.
    helpers.logWarn(
      `adding Android exception domains
      \tYou should not enable exception domains in a production app.`
    );
  }

  // Localhost must be added as an exception domain during development
  if (!configuration.disableDevFeature) {
    const localhostIndex = exceptionDomains.findIndex(domain => {
      if (typeof domain === 'string') {
        return domain === 'localhost';
      } else {
        return domain.domain === 'localhost';
      }
    });

    if (localhostIndex === -1) {
      exceptionDomains.push('localhost');
    }
  }

  if (Array.isArray(exceptionDomains) && exceptionDomains.length > 0) {
    const domainElements = exceptionDomains
      .map(domain => {
        const host = typeof domain === 'string' ? domain : domain.domain;
        return `<domain includeSubdomains="true">${host}</domain>`;
      })
      .join('\n\t\t');

    const xml = `<domain-config cleartextTrafficPermitted="true">
      ${domainElements}
    </domain-config>
    <debug-overrides>`;

    fs.update(
      path.resolve(path.android.resourcesPath(), 'xml', 'network_security_config.xml'),
      '<debug-overrides>',
      xml
    );
  }
}
