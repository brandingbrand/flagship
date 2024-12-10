/**
 * Defines a plugin for @brandingbrand/code-cli-kit.
 * @module Plugin
 */

import {
  definePlugin,
  fs,
  path,
  withInfoPlist,
  withStrings,
} from '@brandingbrand/code-cli-kit';

/**
 * Defines a plugin with functions for both iOS and Android platforms.
 * @alias module:Plugin
 * @param {Object} build - The build configuration object.
 * @param {Object} options - The options object.
 */
export default definePlugin({
  /**
   * Function to be executed for iOS platform.
   * @param {Object} _build - The build configuration object for iOS.
   * @param {Object} _options - The options object for iOS.
   * @returns {Promise<void>} A promise that resolves when the process completes.
   */
  ios: async function (_build: object, options: any): Promise<void> {
    if (!options.appEnvInitial) {
      throw Error('MissingOptionError: missing appEnvInitial variable');
    }

    if (!options.appEnvDir) {
      throw Error('MissingOptionError: missing appEnvDir variable');
    }

    await withInfoPlist(plist => {
      return {
        ...plist,
        FlagshipEnv: options.appEnvInitial,
        FlagshipDevMenu: options.release,
      };
    });

    await fs.writeFile(
      path.join(process.cwd(), '.flagshipappenvrc'),
      JSON.stringify(
        {
          hiddenEnvs: options.appEnvHide || [],
          singleEnv: options.release,
          dir: options.appEnvDir,
        },
        null,
        2,
      ),
    );
  },

  /**
   * Function to be executed for Android platform.
   * @param {Object} _build - The build configuration object for Android.
   * @param {Object} _options - The options object for Android.
   * @returns {Promise<void>} A promise that resolves when the process completes.
   */
  android: async function (_build: object, options: any): Promise<void> {
    if (!options.appEnvInitial) {
      throw Error('MissingOptionError: missing appEnvInitial variable');
    }

    if (!options.appEnvDir) {
      throw Error('MissingOptionError: missing appEnvDir variable');
    }

    await withStrings(xml => {
      xml.resources.string?.push({
        $: {name: 'flagship_env'},
        _: options.appEnvInitial,
      });
      xml.resources.string?.push({
        $: {name: 'flagship_dev_menu'},
        _: `${options.release}`,
      });

      return xml;
    });

    await fs.writeFile(
      path.join(process.cwd(), '.flagshipappenvrc'),
      JSON.stringify(
        {
          hiddenEnvs: options.appEnvHide || [],
          singleEnv: options.release,
          dir: options.appEnvDir,
        },
        null,
        2,
      ),
    );
  },
});
