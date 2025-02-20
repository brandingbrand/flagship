import {
  logger,
  definePlugin,
  PrebuildOptions,
  fs,
  path,
} from '@brandingbrand/code-cli-kit';
import semver from 'semver';

/**
 * Profile configuration containing dependency requirements and restrictions based on React Native version.
 * @see ./profile
 */
import profile from './profile';

/**
 * Interface representing the structure of a package.json file.
 * @interface PackageJson
 * @property {string} name - The name of the package
 * @property {string} version - The package version string
 * @property {Record<string, unknown>} dependencies - Runtime package dependencies
 * @property {Record<string, unknown>} devDependencies - Development package dependencies
 * @property {unknown} [key: string] - Any additional package.json fields
 */
interface PackageJson {
  name: string;
  version: string;
  dependencies: Record<string, unknown>;
  devDependencies: Record<string, unknown>;
  [key: string]: unknown;
}

/**
 * Locates and parses the package.json file for a given package.
 * Traverses up directory tree to support monorepo structures.
 * @param {string} packageName - Name of package to find package.json for
 * @returns {Promise<PackageJson | null>} Parsed package.json contents or null if not found
 * @see PackageJson
 */
async function getPackageJson(
  packageName: string,
): Promise<PackageJson | null> {
  try {
    // Find `node_modules` location manually (supports monorepos)
    let currentDir = process.cwd();

    while (currentDir !== path.parse(currentDir).root) {
      const packagePath = path.join(
        currentDir,
        'node_modules',
        packageName,
        'package.json',
      );

      if (await fileExists(packagePath)) {
        const packageJsonContent = await fs.readFile(packagePath, 'utf-8');
        return JSON.parse(packageJsonContent) as PackageJson;
      }

      // Move up a directory (for monorepos)
      currentDir = path.dirname(currentDir);
    }

    logger.error(`Could not find package.json for ${packageName}`);
    return null;
  } catch (error) {
    logger.error(
      `Error retrieving package.json for ${packageName}:`,
      error as any,
    );
    return null;
  }
}

/**
 * Checks if a file exists at the given path.
 * @param {string} filePath - Path to check for file existence
 * @returns {Promise<boolean>} True if file exists, false otherwise
 */
async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Plugin for verifying project dependencies against React Native version profile.
 * Performs dependency validation including version compatibility checks,
 * banned package detection, and required dependency verification.
 * @module dependency-verification-plugin
 */
export default definePlugin({
  /**
   * Performs dependency verification checks based on React Native profile.
   * @param {*} _ - Unused placeholder parameter
   * @param {PrebuildOptions} options - Build configuration options
   * @returns {Promise<void>} Resolves when verification completes
   * @throws {Error} On critical dependency verification failures
   */
  common: async (_: any, options: PrebuildOptions): Promise<void> => {
    // Select the profile based on the React Native version
    const rnProfile = profile;

    /**
     * Validates dependencies against profile requirements.
     * Checks version compatibility, banned packages, and missing required deps.
     * @param {Record<string, any>} dependencies - Dependencies to validate
     * @throws {Error} On dependency validation failures
     */
    const checkDependencies = async (dependencies: Record<string, any>) => {
      logger.debug('Reading root package.json');
      const rootPackageJson = JSON.parse(
        await fs.readFile(path.project.resolve('package.json'), 'utf-8'),
      );
      const rootDeps = {
        ...rootPackageJson?.dependencies,
        ...rootPackageJson?.devDependencies,
      };

      logger.debug('Starting dependency validation');
      for (const [packageName, config] of Object.entries(dependencies)) {
        if (!rootDeps[packageName]) {
          logger.debug(
            `Skipping ${packageName} - not found in root dependencies`,
          );
          continue;
        }

        try {
          logger.debug(`Checking package: ${packageName}`);
          const installedVersion = (await getPackageJson(packageName))?.version;
          const coercedInstalledVersion =
            semver.coerce(installedVersion)?.version;

          // Check if the required version is satisfied
          if (
            installedVersion &&
            coercedInstalledVersion &&
            !satisfies(coercedInstalledVersion, config.version)
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
    logger.info('Verifying project dependencies...');
    await checkDependencies(rnProfile);

    logger.info('Dependency verification complete.');
  },
});

/**
 * Checks if an installed version satisfies the required version range.
 * @param {string} installed - Installed package version
 * @param {string} range - Required version range
 * @returns {boolean} True if installed version satisfies range
 * @throws {Error} On invalid version format
 */
const satisfies = (installed: string, range: string): boolean => {
  const semver = require('semver');
  return semver.satisfies(installed, range);
};
