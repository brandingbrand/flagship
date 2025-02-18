import {
  logger,
  definePlugin,
  PrebuildOptions,
} from '@brandingbrand/code-cli-kit';

import profile from './profile'; // Import profile configurations based on React Native version

/**
 * A plugin that verifies the dependencies based on the selected React Native version profile.
 * It checks that all required dependencies are installed and verifies that no banned dependencies are present.
 */
export default definePlugin({
  /**
   * The main function that verifies dependencies based on the profile for the React Native version.
   * @param _ - Unused parameter, reserved for possible future extension.
   * @param options - Prebuild options containing configuration details.
   * @returns A Promise representing the completion of dependency verification.
   */
  common: async (_, options: PrebuildOptions): Promise<void> => {
    // Select the profile based on the React Native version
    const rnProfile = profile;

    // Function to check for missing or banned dependencies
    const checkDependencies = (dependencies: Record<string, any>) => {
      for (const [packageName, config] of Object.entries(dependencies)) {
        try {
          const installedVersion = require(
            `${packageName}/package.json`,
          ).version;

          // Check if the required version is satisfied
          if (
            installedVersion &&
            !satisfies(installedVersion, config.version)
          ) {
            logger.warn(
              `Dependency version mismatch for ${packageName}: expected ${config.version}, found ${installedVersion}`,
            );
          }

          // Check if the package is banned
          if (config.banned) {
            logger.warn(`Banned package found: ${packageName}`);
          }

          // Check if the package is required and not installed
          if (config.required && !installedVersion) {
            logger.warn(`Required dependency missing: ${packageName}`);
          }
        } catch (error) {
          logger.error(
            `Error checking package: ${packageName} - ${(error as any).message}`,
          );
        }
      }
    };

    // Verify dependencies for the current project
    logger.log('Verifying project dependencies...');
    checkDependencies(rnProfile);

    logger.log('Dependency verification complete.');
  },
});

/**
 * A helper function to check if the installed version satisfies the version range.
 * @param installed - The installed version of the package.
 * @param range - The version range specified in the profile.
 * @returns Boolean indicating whether the installed version satisfies the range.
 */
const satisfies = (installed: string, range: string): boolean => {
  const semver = require('semver');
  return semver.satisfies(installed, range);
};
