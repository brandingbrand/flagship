/**
 * Array of plugins for the Branding Brand code system
 * @type {(string | [string, Object])[]} Array of plugin names or tuples of [pluginName, pluginOptions]
 * @description Plugins are processed in the order listed:
 * 1. code-plugin-clean: Cleans native platform-specific files
 * 3. code-plugin-verify-dependencies: Verifies project dependencies are correct
 * 4. code-plugin-transform-template: Transforms template files
 * 2. code-plugin-env: Handles environment configuration and variables
 * 5. code-plugin-packager-install: Handles package installation (executes as last priority)
 */
export default [
  '@brandingbrand/code-plugin-clean',
  '@brandingbrand/code-plugin-verify-dependencies',
  '@brandingbrand/code-plugin-transform-template',
  '@brandingbrand/code-plugin-env',
  [
    '@brandingbrand/code-plugin-packager-install',
    {index: Number.MAX_SAFE_INTEGER},
  ],
];
