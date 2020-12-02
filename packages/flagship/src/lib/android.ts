import * as fs from './fs';
import * as path from './path';
import * as helpers from '../helpers';
import * as versionLib from './version';
import * as nativeConstants from './native-constants';
import * as FlagshipTypes from '../types';

const kDefaultGoogleMapsAPIKey = '_FlagshipGoogleMapsAPIKey_';
const EMULATOR_LOCALHOST_PROXY = '10.0.2.2';

const gifSupport = [
  'implementation \'com.facebook.fresco:animated-base-support:1.3.0\'',
  'implementation \'com.facebook.fresco:animated-gif:2.0.0\''
];

const webPSupport = [
  'implementation \'com.facebook.fresco:animated-webp:2.1.0\'',
  'implementation \'com.facebook.fresco:webpsupport:2.0.0\'',
  'implementation \'com.facebook.fresco:webpsupport:2.0.0\''
];

const DEFAULT_ANDROID_CONFIG = {
  build: {
    versionName: (version: string) => version,
    versionShortCode: versionLib.normalize,
    versionCode: '"\${project.VERSION_CODE_SHORT}".toInteger()'
  },
  manifest: {
    activityAttributes: {
      'android:label': '@string/app_name',
      'android:launchMode': 'singleTask',
      'android:configChanges': 'keyboard|keyboardHidden|orientation|screenSize',
      'android:screenOrientation': 'fullSensor',
      'android:windowSoftInputMode': 'adjustResize'
    },
    applicationAttributes: {
      'android:allowBackup': 'false',
      'android:label': '@string/app_name',
      'android:icon': '@mipmap/ic_launcher',
      'android:theme': '@style/AppTheme',
      'android:networkSecurityConfig': '@xml/network_security_config'
    },
    urlSchemeHost: 'app'
  }
};

/**
 * generates android config merging defaults with overrides
 * @param {FlagshipTypes.AndroidConfig | undefined} config - android config override
 * @returns {FlagshipTypes.AndroidConfig} android config
 */
export function androidConfigWithDefault(
  config: FlagshipTypes.AndroidConfig | undefined
): FlagshipTypes.AndroidConfig {
  return {
    build: {
      ...DEFAULT_ANDROID_CONFIG.build,
      ...config && config.build
    },
    manifest: {
      ...DEFAULT_ANDROID_CONFIG.manifest,
      ...config && config.manifest,
      activityAttributes: {
        ...DEFAULT_ANDROID_CONFIG.manifest.activityAttributes,
        ...config && config.manifest && config.manifest.activityAttributes
      },
      applicationAttributes: {
        ...DEFAULT_ANDROID_CONFIG.manifest.applicationAttributes,
        ...config && config.manifest && config.manifest.applicationAttributes
      }
    }
  };
}

/**
 * add additional dependencies to the app/build.gradle
 * @param {FlagshipTypes.AndroidConfig} config - android config
 */
export function additionalDependencies(config: FlagshipTypes.AndroidConfig): void {
  let additionalDependencies: string[] = config.build?.additionalDependencies || [];
  if (config.build?.gifSupport !== false) {
    additionalDependencies = additionalDependencies.concat(gifSupport);
  }
  if (config.build?.webPSupport !== false) {
    additionalDependencies = additionalDependencies.concat(webPSupport);
  }
  if (additionalDependencies.length === 0) {
    return;
  }
  helpers.logInfo('add additional android dependencies');
  fs.update(
    path.android.gradlePath(),
    '// __ADDITIONAL_DEPENDENCIES__',
    additionalDependencies.join('\n    ')
  );
}

/**
 * add additional dependencies to the AndroidManifest
 * @param {FlagshipTypes.AndroidConfig} config - android config
 */
export function additionalPermissions(config: FlagshipTypes.AndroidConfig): void {
  if (!config.manifest || !config.manifest.additionalPermissions) {
    return;
  }
  helpers.logInfo('add additional permissions to manifest');
  const additionalPermissions: string[] = config.manifest.additionalPermissions || [];
  fs.update(
    path.android.manifestPath(),
    '<!-- __ADDITIONAL_PERMISSIONS__ -->',
    additionalPermissions.join('\n    ')
  );
}

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
 * update android manifest .MainActivity activity attributes
 * @param {FlagshipTypes.AndroidConfig} config - android config
 */
export function mainActivityAttributes(config: FlagshipTypes.AndroidConfig): void {
  if (!config.manifest || !config.manifest.activityAttributes) {
    return;
  }
  helpers.logInfo('updating manifest activity attributes');
  const newAttributes: string[] = [];
  const attributes = config.manifest.activityAttributes || {};
  Object.keys(attributes).forEach((key: string) => {
    if (attributes[key]) {
      newAttributes.push(`${key}=\"${attributes[key]}\"`);
    }
  });
  fs.update(
    path.android.manifestPath(),
    '__ACTIIVITY_ATTRIBUTES__="TEMPLATE"',
    newAttributes.join('\n            ')
  );
}

/**
 * update android manifest .MainApplication application attributes
 * @param {FlagshipTypes.AndroidConfig} config - android config
 */
export function mainApplicationAttributes(config: FlagshipTypes.AndroidConfig): void {
  if (!config.manifest || !config.manifest.applicationAttributes) {
    return;
  }
  helpers.logInfo('updating manifest application attributes');
  const newAttributes: string[] = [];
  const attributes = config.manifest.applicationAttributes || {};
  Object.keys(attributes).forEach((key: string) => {
    if (attributes[key]) {
      newAttributes.push(`${key}=\"${attributes[key]}\"`);
    }
  });
  fs.update(
    path.android.manifestPath(),
    '__APP_ATTRIBUTES__="TEMPLATE"',
    newAttributes.join('\n        ')
  );
}

/**
 * update android manifest with additional application elements
 * @param {FlagshipTypes.AndroidConfig} config - android configuration
 */
export function mainApplicationElements(config: FlagshipTypes.AndroidConfig): void {
  if (!config.manifest || !config.manifest.additionalElements) {
    return;
  }
  helpers.logInfo('updating manifest application elements');
  const additionalElements: string[] = config.manifest.additionalElements || [];
  fs.update(
    path.android.manifestPath(),
    '<!-- __ADDITIONAL_APP_ELEMENTS -->',
    additionalElements.join('\n        ')
  );
}

/**
 * Sets the app version number.
 *
 * @param {string} newVersion The version number to set.
 * @param {FlagshipoTypes.AndroidConfig} config - android configuration
 */
export function version(newVersion: string, config: FlagshipTypes.AndroidConfig): void {
  helpers.logInfo(`setting Android version number to ${newVersion}`);

  versionName(newVersion, config);
  versionShortCode(newVersion, config);
  versionCode(newVersion, config);
}

/**
 * update version name in gradle.properties
 *
 * @param {string} newVersion - package json version
 * @param {FlagshipTypes.AndroidConfig} config - android configuration
 */
function versionName(newVersion: string, config: FlagshipTypes.AndroidConfig): void {
  const newVersionName = config.build && config.build.versionName &&
    (typeof config.build.versionName === 'function' ?
      config.build.versionName(newVersion) :
      config.build.versionName) ||
    newVersion;
  fs.update(
    path.android.gradlePropertiesPath(),
    /VERSION_NAME=[\d\.]+/,
    `VERSION_NAME=${newVersionName}`
  );
}
/**
 * update version short code in gradle.properties
 *
 * @param {string} newVersion - package json version
 * @param {FlagshipTypes.AndroidConfig} config - android configuration
 */
function versionShortCode(newVersion: string, config: FlagshipTypes.AndroidConfig): void {
  const newVersionShortCode = config.build && config.build.versionShortCode &&
    (typeof config.build.versionShortCode === 'function' ?
      config.build.versionShortCode(newVersion) :
      config.build.versionShortCode) ||
    versionLib.normalize(newVersion);
  fs.update(
    path.android.gradlePropertiesPath(),
    /VERSION_CODE_SHORT=\d+/,
    `VERSION_CODE_SHORT=${newVersionShortCode}`
  );
}

/**
 * update version code in app/build.gradle
 *
 * @param {string} newVersion - package json version
 * @param {FlagshipTypes.AndroidConfig} config - android configuration
 */
function versionCode(newVersion: string, config: FlagshipTypes.AndroidConfig): void {
  const newVersionCode = config.build && config.build.versionCode &&
    (typeof config.build.versionCode === 'function' ?
      config.build.versionCode(newVersion) :
      config.build.versionCode) ||
    '"\${project.VERSION_CODE_SHORT}".toInteger()';
  fs.update(
    path.android.gradlePath(),
    /^(\s*versionCode ).*$/m,
    `$1${newVersionCode}`
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
 * Sets the default app URL scheme host.
 *
 * @param {FlagshipTypes.AndroidConfig} config - android configuration
 */
export function urlSchemeHost(config: FlagshipTypes.AndroidConfig): void {
  if (config.manifest) {
    const host = config.manifest.urlSchemeHost || '';
    helpers.logInfo(`setting Android URL scheme host path to ${host}`);
    fs.update(path.android.manifestPath(), '__URL_HOST_PATH__', host);
  }
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

  // Localhost (for running on device) and 10.0.2.2 (for running on an emulator) must be
  // added as exception domains during development so that the app can access the js bundle
  if (!configuration.disableDevFeature) {
    const hasLocalhost = hasExceptionDomain(exceptionDomains, 'localhost');
    const hasProxyLocalhost = hasExceptionDomain(exceptionDomains, EMULATOR_LOCALHOST_PROXY);

    if (!hasLocalhost) {
      exceptionDomains.push('localhost');
    }

    if (!hasProxyLocalhost) {
      exceptionDomains.push(EMULATOR_LOCALHOST_PROXY);
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

function hasExceptionDomain(
  domains: FlagshipTypes.Config['exceptionDomains'],
  target: string
): boolean {
  const domainIndex = domains.findIndex(domain => {
    if (typeof domain === 'string') {
      return domain === target;
    } else {
      return domain.domain === target;
    }
  });

  return domainIndex !== -1;
}
