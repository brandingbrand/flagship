import {
  type AndroidManifestXML,
  type BuildConfig,
} from '@brandingbrand/code-cli-kit';

/**
 * Transformer functions for modifying Android manifest XML configuration
 */
export default {
  __test: /\bAndroidManifest\.xml$/,
  /**
   * Configures URL scheme handling in the Android manifest
   * Adds intent filters for handling deep links with the specified scheme and host
   *
   * @param xml - The Android manifest XML object to modify
   * @param config - Build configuration containing URL scheme settings
   * @returns void
   *
   * @example
   * // Example config:
   * {
   *   android: {
   *     manifest: {
   *       urlScheme: {
   *         scheme: 'myapp',
   *         host: 'example.com'
   *       }
   *     }
   *   }
   * }
   */
  urlScheme: function (xml: AndroidManifestXML, config: BuildConfig) {
    // Check if URL scheme configuration is provided in the build configuration
    if (!config.android.manifest?.urlScheme) return;

    // Extract scheme and host from the URL scheme configuration
    const {scheme, host} = config.android.manifest.urlScheme;

    // Find the main application activity in the manifest and update its intent filter
    xml.manifest.application
      ?.find(it => it.$['android:name'] === '.MainApplication')
      ?.activity?.find(it => it.$['android:name'] === '.MainActivity')
      ?.['intent-filter']?.push({
        // Add action for viewing content
        action: [
          {
            $: {
              'android:name': 'android.intent.action.VIEW',
            },
          },
        ],
        // Add categories for default and browsable actions
        category: [
          {
            $: {
              'android:name': 'android.intent.category.DEFAULT',
            },
          },
          {
            $: {
              'android:name': 'android.intent.category.BROWSABLE',
            },
          },
        ],
        // Add data element for URL scheme
        data: [
          {
            $: {
              'android:scheme': scheme,
              ...(host && {
                'android:host': host,
              }),
            },
          },
        ],
      });
  },

  /**
   * Sets the screen orientation for the main activity in the Android manifest
   * Updates the android:screenOrientation attribute of MainActivity
   *
   * @param xml - The Android manifest XML object to modify
   * @param config - Build configuration containing orientation setting
   * @returns void
   * @throws Error if MainActivity is not found in the manifest
   *
   * @example
   * // Example config:
   * {
   *   android: {
   *     manifest: {
   *       orientation: 'portrait'
   *     }
   *   }
   * }
   */
  orientation: function (xml: AndroidManifestXML, config: BuildConfig) {
    // Check if URL scheme configuration is provided in the build configuration
    if (!config.android.manifest?.orientation) return;

    // Extract scheme and host from the URL scheme configuration
    const {orientation} = config.android.manifest;

    // Find the main application activity in the manifest and update its intent filter
    const mainActivity = xml.manifest.application
      ?.find(it => it.$['android:name'] === '.MainApplication')
      ?.activity?.find(it => it.$['android:name'] === '.MainActivity');

    if (!mainActivity) {
      throw new Error(
        '[AndroidManifestTransformer]: cannot set screen orientation because .MainActivity not found',
      );
    }

    mainActivity.$['android:screenOrientation'] = orientation;
  },
};
