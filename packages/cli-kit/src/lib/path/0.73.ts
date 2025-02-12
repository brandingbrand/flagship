import {packageToPath, resolvePathFromProject} from './helper';
import {default as path072} from './0.72';

import {BuildConfig} from '@/@types';

/**
 * Default exported object that extends path72 configuration with Android-specific paths
 * @exports
 */
export default {
  /* Spread operator used to inherit all path configurations from the 0.72 version of React Native paths.
     This allows us to extend or override specific paths while keeping all other paths from the base configuration. */
  ...path072,
  android: {
    /* Spread operator is used to inherit all Android-specific path configurations from path72.
       This ensures we maintain all base Android paths while allowing us to add or override specific paths */
    ...path072.android,
    /**
     * Retrieves the absolute path to the Android MainApplication.kt file.
     * This file contains the main application class that initializes React Native.
     *
     * @param {BuildConfig} config - The Android project configuration object containing package name
     * @returns {string} The absolute file path to MainApplication.kt in the Android project structure
     * @example
     * // Returns path like: '/project/android/app/src/main/java/com/myapp/MainApplication.kt'
     * mainApplication({android: {packageName: 'com.myapp'}})
     */
    mainApplication: function (config: BuildConfig): string {
      return resolvePathFromProject(
        'android',
        'app',
        'src',
        'main',
        'java',
        ...packageToPath(config.android.packageName),
        'MainApplication.kt',
      );
    },

    /**
     * Retrieves the absolute path to the Android MainActivity.kt file.
     * This file contains the main activity class that serves as the entry point for the app.
     *
     * @param {BuildConfig} config - The Android project configuration object containing package name
     * @returns {string} The absolute file path to MainActivity.kt in the Android project structure
     * @example
     * // Returns path like: '/project/android/app/src/main/java/com/myapp/MainActivity.kt'
     * mainActivity({android: {packageName: 'com.myapp'}})
     */
    mainActivity: function (config: BuildConfig): string {
      return resolvePathFromProject(
        'android',
        'app',
        'src',
        'main',
        'java',
        ...packageToPath(config.android.packageName),
        'MainActivity.kt',
      );
    },
  },
} satisfies typeof path072;
