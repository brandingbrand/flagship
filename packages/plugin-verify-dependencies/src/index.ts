import {
  AlignDepsOptions,
  definePlugin,
  fs,
  logger,
  path,
} from '@brandingbrand/code-cli-kit';
import semver from 'semver';

/**
 * Profile configuration containing dependency requirements and restrictions based on React Native version.
 * @see ./profile
 */
import profile, { getProfile } from './profile';
import type { DependencySpec, PackageJsonType } from './types';

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

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function getPackageKey(
  devOnly: boolean = false,
): 'dependencies' | 'devDependencies' {
  return devOnly ? 'devDependencies' : 'dependencies';
}

function updateDependency(
  pkgJson: PackageJsonType,
  packageName: string,
  profile: DependencySpec,
): void {
  const key = getPackageKey(profile.devOnly);
  pkgJson[key] = pkgJson[key] || {};
  pkgJson[key][packageName] = profile.updateVersion ?? profile.version;
}

function removeDependency(pkgJson: PackageJsonType, packageName: string): void {
  if (pkgJson.dependencies && packageName in pkgJson.dependencies) {
    delete pkgJson.dependencies[packageName];
  }
  if (pkgJson.devDependencies && packageName in pkgJson.devDependencies) {
    delete pkgJson.devDependencies[packageName];
  }
}

const satisfies = (installed: string, range: string): boolean => {
  return semver.satisfies(installed, range);
};

export default definePlugin<{}, AlignDepsOptions>({
  common: async (_: any, options: AlignDepsOptions): Promise<void> => {
    const rnProfile = getProfile(options.profile) || profile;
    const rootPkgPath = path.project.resolve('package.json');
    const rootPkgJson: PackageJsonType = JSON.parse(
      await fs.readFile(rootPkgPath, 'utf-8'),
    );

    const rootDeps: Record<string, unknown> = {
      ...rootPkgJson.dependencies,
      ...rootPkgJson.devDependencies,
    };

    logger.info(`Verifying project dependencies using React Native profile...`);

    // First handle capabilities for required or existing dependencies
    for (const [packageName, depConfig] of Object.entries(rnProfile)) {
      const config = depConfig;
      // Only process capabilities if the package is required or already exists
      if (
        config.capabilities?.length &&
        (config.required || rootDeps[packageName])
      ) {
        for (const capability of config.capabilities) {
          const capabilityConfig = rnProfile[
            capability
          ];
          if (capabilityConfig && !rootDeps[capability]) {
            logger.warn(
              `Missing capability ${capability} required by ${packageName}`,
              'verify-deps',
            );
            if (options.fix) {
              updateDependency(
                rootPkgJson,
                capability,
                capabilityConfig,
              );
              logger.info(
                `Added ${capability} with version ${capabilityConfig.version}`,
                'verify-deps',
              );
            }
          }
        }
      }
    }

    // Then handle regular dependency checks
    for (const [depName, depConfig] of Object.entries(rnProfile)) {
      if (!rootDeps[depName]) {
        logger.debug(
          `Skipping ${depName} - not found in root dependencies`,
        );
        continue;
      }

      try {
        logger.debug(`Checking package: ${depName}`);
        const depPkgData = await getPackageJson(depName);
        const installedVersion = depPkgData?.version;
        const coercedInstalledVersion = installedVersion
          ? semver.coerce(installedVersion)?.version
          : null;

        if (
          installedVersion &&
          coercedInstalledVersion &&
          !satisfies(
            coercedInstalledVersion,
            depConfig.version,
          )
        ) {
          logger.warn(
            `Dependency version mismatch for ${depName}: expected ${depConfig.version
            }, found ${installedVersion}. Updating...`,
          );
          updateDependency(
            rootPkgJson,
            depName,
            depConfig,
          );
        }

        if (depConfig.banned) {
          logger.warn(`Banned package found: ${depName}. Removing...`);
          removeDependency(rootPkgJson, depName);
        }

        if (depConfig.required && !installedVersion) {
          logger.warn(`Required dependency missing: ${depName}.`);
          updateDependency(
            rootPkgJson,
            depName,
            depConfig,
          );
        }
      } catch (error) {
        logger.error(
          `Error checking package: ${depName} - ${(error as any).message}`,
        );
      }
    }

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
