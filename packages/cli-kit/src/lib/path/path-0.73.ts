import pathRN72, {resolvePathFromProject, packageToPath} from './path-0.72';

import {BuildConfig} from '@/@types';

export default {
  ...pathRN72,
  android: {
    ...pathRN72.android,
    /**
     * Retrieves the absolute path to the Android MainApplication.java file.
     *
     * @param {BuildConfig} config - The Android project configuration.
     * @returns {string} The absolute path to the MainApplication.java file.
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
     * Retrieves the absolute path to the Android MainActivity.java file.
     *
     * @param {BuildConfig} config - The Android project configuration.
     * @returns {string} The absolute path to the MainActivity.java file.
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
} as typeof pathRN72;
