/**
 * Array of plugins for the Branding Brand code system
 * @type {(string | [string, Object])[]}
 *
 * Plugins in order:
 * - code-plugin-clean: Cleans native platform-specific files
 * - code-plugin-env: Handles environment configuration and variables
 * - code-plugin-verify-dependencies: Verifies project dependencies are correct
 * - code-plugin-transform-template: Transforms template files
 * - code-plugin-packager-install: Handles package installation, runs at priority 1000
 */
export default [
  '@brandingbrand/code-plugin-clean',
  '@brandingbrand/code-plugin-env',
  '@brandingbrand/code-plugin-verify-dependencies',
  '@brandingbrand/code-plugin-transform-template',
  ['@brandingbrand/code-plugin-packager-install', {index: 1000}],
];
