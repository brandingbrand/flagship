import path from "path";

import type { Config } from "../types";

let _pathToProject: string;
let _pathToApp: string;

/**
 * Determines the absolute path to fsapp.
 *
 * @return An absolute path to fsapp.
 */
const getPathToApp = (): string => {
  if (_pathToApp) {
    return _pathToApp;
  }

  _pathToApp = path.resolve(__dirname, "..", "..", "..", "fsapp");

  return _pathToApp;
};

/**
 * Determines the absolute path to the project directory.
 *
 * @return An absolute path to the project directory.
 */
const getPathToProject = (): string => {
  if (_pathToProject) {
    return _pathToProject;
  }

  // npm sets the current working directory to the root module but this might need to
  // get more fancy in the future.
  _pathToProject = process.cwd();

  return _pathToProject;
};

/**
 *  Resolves a path relative to fsapp.
 *
 * @param paths A list of path components to resolve relative to fsapp.
 * @return A resolved path relative to fsapp.
 */
const resolvePathFromApp = (...paths: string[]): string =>
  path.resolve.apply(path, [getPathToApp(), ...paths]);

/**
 * Resolves a path relative to the project directory.
 *
 * @param paths A list of path components to resolve relative to the project.
 * @return A resolved path relative to the project directory.
 */
const resolvePathFromProject = (...paths: string[]): string =>
  path.resolve.apply(path, [getPathToProject(), ...paths]);

/**
 * Returns the path to the iOS Info.plist for the project.
 *
 * @param configuration The project configuration.
 * @return the path
 */
const getInfoPlistPath = (configuration: Config): string =>
  path.resolve(getNativeProjectPathIOS(configuration), "Info.plist");

/**
 * Returns the path to AppDelegate.m file.
 *
 * @param configuration The project configuration.
 * @return The path
 */
const getAppDelegatePath = (configuration: Config): string =>
  resolvePathFromProject("ios", configuration.name, "AppDelegate.m");

/**
 * Returns the path to the Podfile.
 *
 * @return The path to the Podfile.
 */
const getPodfilePath = (): string => resolvePathFromProject("ios", "Podfile");

/**
 * Returns the path to project.pbxproj file.
 *
 * @param configuration The project configuration.
 * @return The path
 */
const getPbxprojFilePath = (configuration: Config): string =>
  resolvePathFromProject(
    "ios",
    `${configuration.name}.xcodeproj`,
    "project.pbxproj"
  );

/**
 * Returns the path to the native project.
 *
 * @param configuration The project configuration.
 * @return The path to the native project.
 */
const getNativeProjectPathIOS = (configuration: Config): string =>
  resolvePathFromProject("ios", configuration.name);

/**
 * Returns the path to the Fastfile
 *
 * @return The path to Fastfile
 */
const getFastfilePathIOS = (): string =>
  resolvePathFromProject("ios", "fastlane", "Fastfile");

/**
 * Returns the path to MainActivity.java
 *
 * @param configuration The project configuration.
 * @return The path to MainActivity.java
 */
const getMainActivityPath = (configuration: Config): string =>
  resolvePathFromProject(
    getNativeProjectPathAndriod(configuration),
    "MainActivity.java"
  );

/**
 * Returns the path to MainApplication.java
 *
 * @param configuration The project configuration.
 * @return The path to MainApplication.java
 */
const getMainApplicationPath = (configuration: Config): string =>
  resolvePathFromProject(
    getNativeProjectPathAndriod(configuration),
    "MainApplication.java"
  );

/**
 * Returns the path to the Android manifest for the project.
 *
 * @return The path to AndroidManifest.xml
 */
const getManifestPath = (): string =>
  resolvePathFromProject(getMainPath(), "AndroidManifest.xml");

/**
 * Returns the path to the native project.
 *
 * @param configuration The project configuration.
 * @return The path to the native project.
 */
const getNativeProjectPathAndriod = (configuration: Config): string => {
  const pkgId =
    configuration.bundleIds && configuration.bundleIds.android
      ? configuration.bundleIds.android
      : `com.brandingbrand.reactnative.and.${configuration.name}`;

  return resolvePathFromProject(
    getMainPath(),
    "java",
    ...pkgId.toLowerCase().split(".")
  );
};

/**
 * Returns the path to build.gralde.
 *
 * @return The path to build.gralde
 */
const getGradlePath = (): string =>
  resolvePathFromProject("android", "app", "build.gradle");

/**
 * Returns the path to gradle.properties.
 *
 * @return The path to gradle.properties
 */
const getGradlePropertiesPath = (): string =>
  resolvePathFromProject("android", "gradle.properties");

/**
 * Returns the path to the main directory.
 *
 * @return The path to the main directory.
 */
const getMainPath = (): string =>
  resolvePathFromProject("android", "app", "src", "main");

/**
 * Returns the path to the main directory.
 *
 * @return The path to the main directory.
 */
const getDebugPath = (): string =>
  resolvePathFromProject("android", "app", "src", "debug");

/**
 * Returns the path to the assets directory.
 *
 * @return The path to the assets directory.
 */
const getAssetsPath = (): string =>
  resolvePathFromProject(getMainPath(), "assets");

/**
 * Returns the path to the resources directory.
 *
 * @return The path to the resources directory.
 */
const getResourcesPath = (): string =>
  resolvePathFromProject(getMainPath(), "res");

/**
 * Returns the path to strings.xml.
 *
 * @return The path to strings.xml
 */
const getStringsPath = (): string =>
  resolvePathFromProject(getResourcesPath(), "values", "strings.xml");

/**
 * Returns the path to styles.xml.
 *
 * @return The path to strings.xml
 */
const getStylesPath = (): string =>
  resolvePathFromProject(getResourcesPath(), "values", "styles.xml");

/**
 * Returns the path to the Fastfile
 *
 * @return The path to Fastfile
 */
const getFastfilePathAndroid = (): string =>
  resolvePathFromProject("android", "fastlane", "Fastfile");

export { basename, extname, normalize, resolve, sep } from "path";

export const app = {
  path: getPathToApp,
  resolve: resolvePathFromApp,
};

export const project = {
  path: getPathToProject,
  resolve: resolvePathFromProject,
};

export const ios = {
  appDelegatePath: getAppDelegatePath,
  fastfilePath: getFastfilePathIOS,
  infoPlistPath: getInfoPlistPath,
  podfilePath: getPodfilePath,
  pbxprojFilePath: getPbxprojFilePath,
  nativeProjectPath: getNativeProjectPathIOS,
};

export const android = {
  mainActivityPath: getMainActivityPath,
  mainApplicationPath: getMainApplicationPath,
  manifestPath: getManifestPath,
  nativeProjectPath: getNativeProjectPathAndriod,
  gradlePath: getGradlePath,
  gradlePropertiesPath: getGradlePropertiesPath,
  mainPath: getMainPath,
  debugPath: getDebugPath,
  assetsPath: getAssetsPath,
  resourcesPath: getResourcesPath,
  stringsPath: getStringsPath,
  stylesPath: getStylesPath,
  fastfilePath: getFastfilePathAndroid,
};
