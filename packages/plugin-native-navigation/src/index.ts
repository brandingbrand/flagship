/**
 * Defines a plugin for @brandingbrand/code-cli-kit.
 * @module Plugin
 */

import { definePlugin, fs } from "@brandingbrand/code-cli-kit";

/**
 * Defines a plugin with functions for both iOS and Android platforms.
 * @alias module:Plugin
 * @param {Object} build - The build configuration object.
 * @param {Object} options - The options object.
 */
export default definePlugin({
  /**
   * Function to be executed for iOS platform.
   * @param {Object} build - The build configuration object for iOS.
   * @param {Object} options - The options object for iOS.
   * @returns {Promise<void>} A promise that resolves when the process completes.
   */
  ios: async function (build: object, options: object): Promise<void> {
    // Resolve path to react-native-navigation postlink path module
    const rnnPath = require.resolve(
      "react-native-navigation/autolink/postlink/path.js",
      { paths: [process.cwd()] }
    );

    // Update mainApplicationJava in postlink path module
    await fs.update(rnnPath, /(mainApplicationJava)\S*(replace)/, `$1?.$2`);

    // Resolve path to react-native-navigation postlink IOS script
    const scriptPath = require.resolve(
      "react-native-navigation/autolink/postlink/postLinkIOS.js",
      { paths: [process.cwd()] }
    );

    // Set executable permission for postlink IOS script
    await fs.chmod(scriptPath, "755");

    // Require postlink IOS script
    const rnnIOSLink = require(scriptPath);

    // Execute postlink IOS script
    await rnnIOSLink();
  },

  /**
   * Function to be executed for Android platform.
   * @param {Object} build - The build configuration object for Android.
   * @param {Object} options - The options object for Android.
   * @returns {Promise<void>} A promise that resolves when the process completes.
   */
  android: async function (build: object, options: object): Promise<void> {
    // Resolve path to react-native-navigation postlink Android script
    const scriptPath = require.resolve(
      "react-native-navigation/autolink/postlink/postLinkAndroid.js",
      { paths: [process.cwd()] }
    );

    // Set executable permission for postlink Android script
    await fs.chmod(scriptPath, "755");

    // Require postlink Android script
    const rnnAndroidLink = require(scriptPath);

    // Execute postlink Android script
    await rnnAndroidLink();
  },
});
