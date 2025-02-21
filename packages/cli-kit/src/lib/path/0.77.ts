import {resolvePathFromProject} from './0.72';
import {default as path073} from './0.73';

/**
 * Default exported object that extends path73 configuration with iOS-specific paths.
 * @exports
 * @default
 */
export default {
  /**
   * Spreads all path configurations from React Native 0.73 paths.
   * This allows inheriting base configuration while enabling path overrides.
   */
  ...path073,
  ios: {
    /**
     * Spreads all iOS-specific path configurations from path73.
     * Maintains base iOS paths while allowing specific path customization.
     */
    ...path073.ios,
    /**
     * The absolute path to the iOS AppDelegate.swift file.
     * @returns {string} The absolute path to "ios/app/AppDelegate.swift".
     */
    appDelegate: resolvePathFromProject('ios', 'app', 'AppDelegate.swift'),
  },
} satisfies typeof path073;
