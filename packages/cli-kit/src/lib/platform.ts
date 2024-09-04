import semver from 'semver';

import type {PrebuildOptions} from '@/@types';

/**
 * Boolean indicating whether the current operating system is macOS.
 */
export const isOSX = process.platform.startsWith('darwin');

/**
 * Boolean indicating whether the current operating system is Linux.
 */
export const isLinux = process.platform.startsWith('linux');

/**
 * Boolean indicating whether the current operating system is Windows.
 */
export const isWindows = process.platform.startsWith('win32');

/**
 * Checks if the current environment can run an iOS platform.
 *
 * @param {PrebuildOptions} options - The options object.
 * @returns {boolean} True if the environment is macOS and the platform is either "ios" or "native", otherwise false.
 */
export function canRunIOS(options: PrebuildOptions): boolean {
  return isOSX && (options.platform === 'ios' || options.platform === 'native');
}

/**
 * Checks if the current environment can run an Android platform.
 *
 * @param {PrebuildOptions} options - The options object.
 * @returns {boolean} True if the environment is macOS, Linux, or Windows, and the platform is either "android" or "native", otherwise false.
 */
export function canRunAndroid(options: PrebuildOptions): boolean {
  return (
    (isOSX || isLinux || isWindows) &&
    (options.platform === 'android' || options.platform === 'native')
  );
}

/**
 * Gets the major and minor version of the installed React Native package. The major and minor version
 * combination can short-circuit this function with the global variable FLAGSHIP_CODE_REACT_NATIVE_VERSION.
 *
 * Currently this is useful for unit tests when specifying specific templates to test.
 *
 * @returns {string} The major and minor version of React Native, in the format 'X.Y'.
 * @throws Will throw an error if the version is undefined or if the major or minor version cannot be determined.
 *
 * @example
 * ```typescript
 * const reactNativeVersion = getReactNativeVersion();
 * console.log(reactNativeVersion); // Example output: "0.72"
 * ```
 */
export function getReactNativeVersion(): string {
  /**
   * Checks if the current environment is a Jest testing environment with a specific
   * React Native version and returns that version if it exists.
   *
   * @returns {string} The React Native version if it is set, otherwise continue.
   */
  if (
    // Check if global object has the property FLAGSHIP_CODE_REACT_NATIVE_VERSION
    (global as any).FLAGSHIP_CODE_REACT_NATIVE_VERSION
  ) {
    // Return the React Native version
    return (global as any).FLAGSHIP_CODE_REACT_NATIVE_VERSION;
  }

  // Import the version from the React Native package.json
  const {version} = require(
    require.resolve('react-native/package.json', {
      paths: [process.cwd()],
    }),
  );

  // Check if the version is undefined and throw an error if it is
  if (!version) {
    throw Error(
      'Type Mismatch: react-native version is expected to be defined.',
    );
  }

  // Coerce the version into a SemVer object
  const coercedVersion = semver.coerce(version);

  // Check if the major version is undefined and throw an error if it is
  if (typeof coercedVersion?.major !== 'number') {
    throw Error(
      'Type Mismatch: react-native major version is expected to be defined.',
    );
  }

  // Check if the minor version is undefined and throw an error if it is
  if (typeof coercedVersion?.minor !== 'number') {
    throw Error(
      'Type Mismatch: react-native minor version is expected to be defined.',
    );
  }

  // Return the major and minor version in the format 'X.Y'
  return `${coercedVersion.major}.${coercedVersion.minor}`;
}
