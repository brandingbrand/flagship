import {defineConfig} from '@brandingbrand/code-cli-kit';

/**
 * Defines the configuration for the Code CLI tool. This configuration file controls how the CLI
 * tool builds and configures your application, including build paths, environment settings, and plugin loading.
 *
 * @module config
 * @returns {object} The configuration object that specifies build directory locations, environment settings,
 *                   preset configurations, and enabled plugins for the application
 */
export default defineConfig({
  /**
   * The path to the build directory where compiled and processed files will be output.
   * This directory contains the final build artifacts ready for deployment.
   * @type {string}
   * @default './coderc/build'
   */
  buildPath: './coderc/build',

  /**
   * The path to the environment directory containing environment-specific configuration files.
   * These files can include API endpoints, feature flags, and other environment variables.
   * @type {string}
   * @default './coderc/env'
   */
  envPath: './coderc/env',

  /**
   * The path to the plugin directory where custom plugins are stored.
   * Plugins extend the functionality of the CLI tool with additional features and capabilities.
   * @type {string}
   * @default './coderc/plugins'
   */
  pluginPath: './coderc/plugins',

  /**
   * The preset configuration to use for the application.
   * This preset provides default settings and configurations for React Native projects.
   * @type {string}
   * @default '@brandingbrand/code-preset-react-native'
   */
  preset: '@brandingbrand/code-preset-react-native',

  /**
   * An array of plugin names to load and enable for the application.
   * Each plugin provides specific functionality:
   * - asset: Manages static assets
   * - app-icon: Configures application icons
   * - permissions: Manages app permissions
   * - splash-screen: Handles splash screen configuration
   * - example: Provides example implementations
   * @type {string[]}
   */
  plugins: [
    '@brandingbrand/code-plugin-asset',
    '@brandingbrand/code-plugin-app-icon',
    '@brandingbrand/code-plugin-splash-screen',
    '@brandingbrand/code-plugin-monorepo',
  ],
});
