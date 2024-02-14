import {defineConfig} from '@brandingbrand/code-cli-kit';

/**
 * Defines the configuration for the Code CLI tool.
 *
 * @returns {object} The configuration object.
 */
export default defineConfig({
  /**
   * The path to the build directory.
   */
  buildPath: './coderc/build',

  /**
   * The path to the environment directory.
   */
  envPath: './coderc/env',

  /**
   * The path to the plugin directory.
   */
  pluginPath: './coderc/plugins',

  /**
   * An array of plugin names.
   */
  plugins: [
    '@brandingbrand/code-plugin-native-navigation',
    '@brandingbrand/code-plugin-asset',
  ],
});
