import {
  logger,
  definePlugin,
  fs,
  path,
  AlignDepsOptions,
} from '@brandingbrand/code-cli-kit';
import semver from 'semver';

/**
 * Profile configuration containing dependency requirements and restrictions based on React Native version.
 * @see ./profile
 */
import profile from './profile';

/**
 * Interface representing the structure of a package.json file.
 */
interface PackageJsonType {
  name: string;
  version: string;
  dependencies: Record<string, unknown>;
  devDependencies: Record<string, unknown>;
  [key: string]: unknown;
}

/**
 * Traverses upward from the current directory to locate the package.json for a given package.
 */
async function getPackageJson(
  packageName: string,
): Promise<PackageJsonType | null> {
  try {
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
        return JSON.parse(packageJsonContent) as PackageJsonType;
      }
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
 * Helper: Determines the correct package key for a dependency.
 */
function getPackageKey(
  devOnly: boolean = false,
): 'dependencies' | 'devDependencies' {
  return devOnly ? 'devDependencies' : 'dependencies';
}

/**
 * Updates the dependency version for a given package in the provided package.json object.
 */
function updateDependency(
  pkgJson: PackageJsonType,
  packageName: string,
  requiredVersion: string,
  devOnly: boolean = false,
): void {
  const key = getPackageKey(devOnly);
  // Ensure the section exists
  pkgJson[key] = pkgJson[key] || {};
  pkgJson[key][packageName] = requiredVersion;
}

/**
 * Removes a dependency from both dependencies and devDependencies.
 */
function removeDependency(pkgJson: PackageJsonType, packageName: string): void {
  if (pkgJson.dependencies && packageName in pkgJson.dependencies) {
    delete pkgJson.dependencies[packageName];
  }
  if (pkgJson.devDependencies && packageName in pkgJson.devDependencies) {
    delete pkgJson.devDependencies[packageName];
  }
}

/**
 * Checks if an installed version satisfies the required version range.
 */
const satisfies = (installed: string, range: string): boolean => {
  return semver.satisfies(installed, range);
};

/**
 * Plugin for verifying and updating project dependencies against a React Native profile.
 * If options.save is true, the updated package.json is written back to disk.
 */
export default definePlugin<{}, AlignDepsOptions>({
  common: async (_: any, options: AlignDepsOptions): Promise<void> => {
    // Use the profile (assumed to be an object where keys are package names)
    const rnProfile = profile;
    const rootPkgPath = path.project.resolve('package.json');
    const rootPkgJson: PackageJsonType = JSON.parse(
      await fs.readFile(rootPkgPath, 'utf-8'),
    );

    // Combine dependencies and devDependencies for lookup
    const rootDeps: Record<string, unknown> = {
      ...rootPkgJson.dependencies,
      ...rootPkgJson.devDependencies,
    };

    logger.info(`Verifying project dependencies using React Native profile...`);

    // Iterate over each dependency defined in the profile
    for (const [packageName, depConfig] of Object.entries(rnProfile)) {
      // If the dependency is not present in the root package.json, skip it.
      if (!rootDeps[packageName]) {
        logger.debug(
          `Skipping ${packageName} - not found in root dependencies`,
        );
        continue;
      }

      try {
        logger.debug(`Checking package: ${packageName}`);
        const pkgData = await getPackageJson(packageName);
        const installedVersion = pkgData?.version;
        const coercedInstalledVersion = installedVersion
          ? semver.coerce(installedVersion)?.version
          : null;

        // If installed and version doesn't satisfy, update it.
        if (
          installedVersion &&
          coercedInstalledVersion &&
          !satisfies(coercedInstalledVersion, (depConfig as any).version)
        ) {
          logger.warn(
            `Dependency version mismatch for ${packageName}: expected ${(depConfig as any).version}, found ${installedVersion}. Updating...`,
          );
          // Update the dependency in the correct section.
          const devOnly = !!(depConfig as any).devOnly;
          updateDependency(
            rootPkgJson,
            packageName,
            (depConfig as any).version,
            devOnly,
          );
        }

        // If the dependency is banned, remove it.
        if ((depConfig as any).banned) {
          logger.warn(`Banned package found: ${packageName}. Removing...`);
          removeDependency(rootPkgJson, packageName);
        }

        // If the dependency is required but missing an installed version, warn (could also add it)
        if ((depConfig as any).required && !installedVersion) {
          logger.warn(`Required dependency missing: ${packageName}.`);
          // Optionally, you might update or add the dependency here.
          updateDependency(
            rootPkgJson,
            packageName,
            (depConfig as any).version,
            !!(depConfig as any).devOnly,
          );
        }
      } catch (error) {
        logger.error(
          `Error checking package: ${packageName} - ${(error as any).message}`,
        );
      }
    }

    // Optionally log the diff between original and updated dependencies
    const originalDeps = {
      ...rootPkgJson.dependencies,
      ...rootPkgJson.devDependencies,
    };
    logger.info('Dependency verification and update complete.');

    if (options.fix) {
      await fs.writeFile(
        rootPkgPath,
        JSON.stringify(rootPkgJson, null, 2),
        'utf-8',
      );
      logger.info('package.json has been saved with updated dependencies.');
    } else {
      logger.info('Dry-run mode: package.json was not saved.');
    }
  },
});
