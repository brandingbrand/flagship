import {
  logger,
  definePlugin,
  PrebuildOptions,
  fs,
  path,
} from '@brandingbrand/code-cli-kit';

/**
 * Imports profile configurations from ./profile based on React Native version.
 * The profile contains dependency requirements and restrictions.
 */
import profile from './profile';

/**
 * Interface representing the structure of a package.json file.
 * @interface PackageJson
 * @property {string} name - The name of the package
 * @property {string} version - The version of the package
 * @property {Record<string, unknown>} dependencies - Object containing runtime dependencies
 * @property {Record<string, unknown>} devDependencies - Object containing development dependencies
 * @property {unknown} [key: string] - Additional fields that may exist in package.json
 */
interface PackageJson {
  name: string;
  version: string;
  dependencies: Record<string, unknown>;
  devDependencies: Record<string, unknown>;
  [key: string]: unknown;
}

/**
 * Retrieves and parses the package.json file for a given package.
 * @param {string} packageName - The name of the package to retrieve package.json for
 * @returns {Promise<PackageJson | null>} The parsed package.json contents or null if retrieval fails
 * @throws Will not throw but logs errors if package.json cannot be found or parsed
 */
async function getPackageJson(
  packageName: string,
): Promise<PackageJson | null> {
  try {
    // Resolve the package's entry point
    const packageMainPath = require.resolve(packageName);

    // Find the package root directory
    const packageRoot =
      packageMainPath.split(`${packageName}`)[0] + packageName;

    // Construct the path to package.json
    const packageJsonPath = path.join(packageRoot, 'package.json');

    // Read and parse the JSON file
    const packageJson: PackageJson = JSON.parse(
      await fs.readFile(packageJsonPath, 'utf-8'),
    );

    return packageJson;
  } catch (error) {
    console.error(`Error retrieving package.json for ${packageName}:`, error);
    return null;
  }
}

/**
 * A plugin that verifies the dependencies based on the selected React Native version profile.
 * It checks that all required dependencies are installed and verifies that no banned dependencies are present.
 * Warns about version mismatches, missing required dependencies, and presence of banned packages.
 * @module dependency-verification-plugin
 */
export default definePlugin({
  /**
   * The main function that verifies dependencies based on the profile for the React Native version.
   * Performs the following checks:
   * - Verifies installed versions match required versions
   * - Checks for presence of banned dependencies
   * - Ensures all required dependencies are installed
   * @param {*} _ - Unused parameter, reserved for possible future extension
   * @param {PrebuildOptions} options - Prebuild options containing configuration details
   * @returns {Promise<void>} A Promise representing the completion of dependency verification
   * @throws {Error} If dependency verification encounters critical errors
   */
  common: async (_, options: PrebuildOptions): Promise<void> => {
    // Select the profile based on the React Native version
    const rnProfile = profile;

    /**
     * Internal function to check for missing or banned dependencies.
     * Processes each dependency against the profile requirements.
     * @param {Record<string, any>} dependencies - Map of dependencies to verify
     * @throws {Error} If dependency checking encounters critical errors
     */
    const checkDependencies = async (dependencies: Record<string, any>) => {
      const rootPackageJson = await getPackageJson(
        path.project.resolve('package.json'),
      );
      for (const [packageName, config] of Object.entries(dependencies)) {
        try {
          const installedVersion = (await getPackageJson(packageName))?.version;

          // Check if the required version is satisfied
          if (
            installedVersion &&
            !satisfies(installedVersion, config.version)
          ) {
            logger.warn(
              `Dependency version mismatch for ${packageName}: expected ${config.version}, found ${installedVersion}`,
            );
          }

          const rootDependenciesAndDevDependencies = [
            ...Object.keys(rootPackageJson?.dependencies || {}),
            ...Object.keys(rootPackageJson?.devDependencies || {}),
          ];

          // Check if the package is banned
          if (
            config.banned &&
            rootDependenciesAndDevDependencies.includes(packageName)
          ) {
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
    await checkDependencies(rnProfile);

    logger.log('Dependency verification complete.');
  },
});

/**
 * A helper function to check if the installed version satisfies the version range.
 * Uses semver package to perform semantic version comparison.
 * @param {string} installed - The installed version of the package
 * @param {string} range - The version range specified in the profile
 * @returns {boolean} True if installed version satisfies the range, false otherwise
 * @throws {Error} If semver comparison fails due to invalid version strings
 */
const satisfies = (installed: string, range: string): boolean => {
  const semver = require('semver');
  return semver.satisfies(installed, range);
};
