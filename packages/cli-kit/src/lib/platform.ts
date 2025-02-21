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
