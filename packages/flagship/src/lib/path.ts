import { Config } from '../types';

const path = require('path');
let _pathToFLAGSHIP: string;
let _pathToProject: string;
let _pathToApp: string;

/**
 * Determines the absolute path to FLAGSHIP.
 *
 * @returns {string} An absolute path to FLAGSHIP.
 */
function getPathToFLAGSHIP(): string {
  if (_pathToFLAGSHIP) {
    return _pathToFLAGSHIP;
  }

  _pathToFLAGSHIP = path.resolve(__dirname, '..', '..');

  return _pathToFLAGSHIP;
}

/**
 * Determines the absolute path to fsapp.
 *
 * @returns {string} An absolute path to fsapp.
 */
function getPathToApp(): string {
  if (_pathToApp) {
    return _pathToApp;
  }

  _pathToApp = path.resolve(__dirname, '..', '..', '..', 'fsapp');

  return _pathToApp;
}

/**
 * Determines the absolute path to the project directory.
 *
 * @returns {string} An absolute path to the project directory.
 */
function getPathToProject(): string {
  if (_pathToProject) {
    return _pathToProject;
  }

  // npm sets the current working directory to the root module but this might need to
  // get more fancy in the future.
  _pathToProject = process.cwd();

  return _pathToProject;
}

/**
 *  Resolves a path relative to FLAGSHIP.
 *
 * @param {...string} paths A list of path components to resolve relative to FLAGSHIP.
 * @returns {string} A resolved path relative to FLAGSHIP.
 */
function resolvePathFromFLAGSHIP(...paths: string[]): string {
  return path.resolve.apply(path, [getPathToFLAGSHIP(), ...paths]);
}

/**
 *  Resolves a path relative to fsapp.
 *
 * @param {...string} paths A list of path components to resolve relative to fsapp.
 * @returns {string} A resolved path relative to fsapp.
 */
function resolvePathFromApp(...paths: string[]): string {
  return path.resolve.apply(path, [getPathToApp(), ...paths]);
}

/**
 * Resolves a path relative to the project directory.
 *
 * @param {...string} paths A list of path components to resolve relative to the project.
 * @returns {string} A resolved path relative to the project directory.
 */
function resolvePathFromProject(...paths: string[]): string {
  return path.resolve.apply(path, [getPathToProject(), ...paths]);
}

/**
 * Returns the path to the iOS Info.plist for the project.
 *
 * @param {object} configuration The project configuration.
 * @returns {string} the path
 */
function getInfoPlistPath(configuration: Config): string {
  return path.resolve(getNativeProjectPathIOS(configuration), 'Info.plist');
}

/**
 * Returns the path to AppDelegate.m file.
 * @param {object} configuration The project configuration.
 * @returns {string} The path
 */
function getAppDelegatePath(configuration: Config): string {
  return resolvePathFromProject('ios', configuration.name, 'AppDelegate.m');
}

/**
 * Returns the path to the Podfile.
 * @returns {string} The path to the Podfile.
 */
function getPodfilePath(): string {
  return resolvePathFromProject('ios', 'Podfile');
}

/**
 * Returns the path to project.pbxproj file.
 * @param {object} configuration The project configuration.
 * @returns {string} The path
 */
function getPbxprojFilePath(configuration: Config): string {
  return resolvePathFromProject('ios', `${configuration.name}.xcodeproj`, 'project.pbxproj');
}

/**
 * Returns the path to the native project.
 * @param {object} configuration The project configuration.
 * @returns {string} The path to the native project.
 */
function getNativeProjectPathIOS(configuration: Config): string {
  return resolvePathFromProject('ios', configuration.name);
}

/**
 * Returns the path to the Fastfile
 * @returns {string} The path to Fastfile
 */
function getFastfilePathIOS(): string {
  return resolvePathFromProject('ios', 'fastlane', 'Fastfile');
}

/**
 * Returns the path to MainActivity.java
 *
 * @param {object} configuration The project configuration.
 * @returns {string} The path to MainActivity.java
 */
function getMainActivityPath(configuration: Config): string {
  return resolvePathFromProject(getNativeProjectPathAndriod(configuration), 'MainActivity.java');
}

/**
 * Returns the path to MainApplication.java
 *
 * @param {object} configuration The project configuration.
 * @returns {string} The path to MainApplication.java
 */
function getMainApplicationPath(configuration: Config): string {
  return resolvePathFromProject(getNativeProjectPathAndriod(configuration), 'MainApplication.java');
}

/**
 * Returns the path to the Android manifest for the project.
 * @returns {string} The path to AndroidManifest.xml
 */
function getManifestPath(): string {
  return resolvePathFromProject(getMainPath(), 'AndroidManifest.xml');
}

/**
 * Returns the path to the native project.
 * @param {object} configuration The project configuration.
 * @returns {string} The path to the native project.
 */
function getNativeProjectPathAndriod(configuration: Config): string {
  return resolvePathFromProject(
    getMainPath(),
    'java',
    'com',
    'brandingbrand',
    'reactnative',
    'and',
    configuration.name.toLowerCase()
  );
}

/**
 * Returns the path to build.gralde.
 * @returns {string} The path to build.gralde
 */
function getGradlePath(): string {
  return resolvePathFromProject('android', 'app', 'build.gradle');
}

/**
 * Returns the path to gradle.properties.
 * @returns {string} The path to gradle.properties
 */
function getGradlePropertiesPath(): string {
  return resolvePathFromProject('android', 'gradle.properties');
}

/**
 * Returns the path to the main directory.
 * @returns {string} The path to the main directory.
 */
function getMainPath(): string {
  return resolvePathFromProject('android', 'app', 'src', 'main');
}

/**
 * Returns the path to the assets directory.
 * @returns {string} The path to the assets directory.
 */
function getAssetsPath(): string {
  return resolvePathFromProject(getMainPath(), 'assets');
}

/**
 * Returns the path to the resources directory.
 * @returns {string} The path to the resources directory.
 */
function getResourcesPath(): string {
  return resolvePathFromProject(getMainPath(), 'res');
}

/**
 * Returns the path to strings.xml.
 * @returns {string} The path to strings.xml
 */
function getStringsPath(): string {
  return resolvePathFromProject(getResourcesPath(), 'values', 'strings.xml');
}

/**
 * Returns the path to styles.xml.
 * @returns {string} The path to strings.xml
 */
function getStylesPath(): string {
  return resolvePathFromProject(getResourcesPath(), 'values', 'styles.xml');
}

/**
 * Returns the path to the Fastfile
 * @returns {string} The path to Fastfile
 */
function getFastfilePathAndroid(): string {
  return resolvePathFromProject('android', 'fastlane', 'Fastfile');
}

export const resolve = path.resolve;
export const extname = path.extname;
export const basename = path.basename;
export const sep = path.sep;
export const normalize = path.normalize;

export const flagship = {
  path: getPathToFLAGSHIP,
  resolve: resolvePathFromFLAGSHIP
};

export const app = {
  path: getPathToApp,
  resolve: resolvePathFromApp
};

export const project = {
  path: getPathToProject,
  resolve: resolvePathFromProject
};

export const ios = {
  appDelegatePath: getAppDelegatePath,
  fastfilePath: getFastfilePathIOS,
  infoPlistPath: getInfoPlistPath,
  podfilePath: getPodfilePath,
  pbxprojFilePath: getPbxprojFilePath,
  nativeProjectPath: getNativeProjectPathIOS
};

export const android = {
  mainActivityPath: getMainActivityPath,
  mainApplicationPath: getMainApplicationPath,
  manifestPath: getManifestPath,
  nativeProjectPath: getNativeProjectPathAndriod,
  gradlePath: getGradlePath,
  gradlePropertiesPath: getGradlePropertiesPath,
  mainPath: getMainPath,
  assetsPath: getAssetsPath,
  resourcesPath: getResourcesPath,
  stringsPath: getStringsPath,
  stylesPath: getStylesPath,
  fastfilePath: getFastfilePathAndroid
};
