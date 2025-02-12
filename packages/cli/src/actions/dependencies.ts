import PackageJson from '@npmcli/package-json';
import semver from 'semver';
import chalk from 'chalk';
import {getReactNativeVersion, logger} from '@brandingbrand/code-cli-kit';

import {config, defineAction, profiles, type Profile} from '@/lib';

/**
 * Updates dependencies in package.json based on the specified React Native profile.
 */
export default defineAction(
  /**
   * Main function to verify and update package dependencies.
   * @returns {Promise<void>} A promise that resolves when the action is complete.
   */
  async (): Promise<void> => {
    logger.info(
      `checking project version react-native@${getReactNativeVersion()} against profile version react-native@${config.alignDepsOptions.profile}`,
    );
    logger.info('');

    const pkg = await PackageJson.load(process.cwd());
    const ogDeps = Object.freeze(pkg.content.dependencies);
    const ogDevDeps = Object.freeze(pkg.content.devDependencies);
    const reactNativeVersion = config.alignDepsOptions.profile;

    // Check if the React Native version is supported
    if (!(reactNativeVersion in profiles)) {
      throw new Error(
        `Unsupported React Native version: ${reactNativeVersion}`,
      );
    }

    const reactNativeProfile =
      profiles[reactNativeVersion as keyof typeof profiles];

    const executedProfiles: string[] = [];

    /**
     * Returns the appropriate package key based on the `devOnly` flag.
     *
     * @param {boolean} [devOnly=false] - A flag indicating whether to return the key for development dependencies.
     * @returns {string} The package key, either 'devDependencies' if `devOnly` is true, or 'dependencies' if `devOnly` is false.
     */
    function getPackageKey(
      devOnly: boolean = false,
    ): 'dependencies' | 'devDependencies' {
      if (devOnly) {
        return 'devDependencies';
      }

      return 'dependencies';
    }

    /**
     * Verifies and updates a dependency based on the given profile.
     * @param {string} dependency - The name of the dependency.
     * @param {Profile} profile - The profile specifying the version and other details for the dependency.
     */
    function verifyDependency(dependency: string, profile: Profile): void {
      if (executedProfiles.includes(dependency)) return;

      executedProfiles.push(dependency);

      const pkgKey = getPackageKey(profile.devOnly);
      const version = pkg.content?.[pkgKey]?.[dependency];

      // Update the dependency if the version is not satisfied or not present, and the dependency is not banned
      if (
        (!version ||
          !semver.satisfies(
            semver.coerce(version) || version,
            profile.version,
          )) &&
        !profile.banned
      ) {
        pkg.update({
          [pkgKey]: {
            ...(pkg.content[pkgKey] as any),
            [dependency]: profile.version,
          },
        });
      }

      // If the dependency is marked as dev-only but exists in the main dependencies, remove it from dependencies
      if (profile.devOnly && pkg.content.dependencies?.[dependency]) {
        delete pkg.content.dependencies[dependency];
      }

      // If the dependency is not marked as dev-only but exists in devDependencies, remove it from devDependencies
      if (!profile.devOnly && pkg.content.devDependencies?.[dependency]) {
        delete pkg.content.devDependencies[dependency];
      }

      // Remove the dependency if it is banned
      if (profile.banned) {
        if (
          pkg.content.dependencies &&
          dependency in pkg.content.dependencies
        ) {
          delete pkg.content.dependencies[dependency];
        }

        if (
          pkg.content.devDependencies &&
          dependency in pkg.content.devDependencies
        ) {
          delete pkg.content.devDependencies[dependency];
        }
      }

      // Recursively verify dependencies for capabilities
      return profile.capabilities?.forEach(it =>
        verifyDependency(it, reactNativeProfile[it] as Profile),
      );
    }

    // Verify required dependencies
    Object.entries(reactNativeProfile)
      .filter(([, value]) => value.required)
      .forEach(([key, value]) => {
        verifyDependency(key, value);
      });

    // Verify non-required dependencies that are already in package.json
    Object.entries(reactNativeProfile)
      .filter(([key]) => !executedProfiles.includes(key))
      .filter(([key]) =>
        Object.keys({
          ...pkg.content.dependencies,
          ...pkg.content.devDependencies,
        }).includes(key),
      )
      .forEach(([key, value]) => {
        verifyDependency(key, value);
      });

    // Update package.json with the final dependencies
    pkg.update({
      dependencies: {
        ...(pkg.content.dependencies as any),
      },
      devDependencies: {
        ...(pkg.content.devDependencies as any),
      },
    });

    if (config.alignDepsOptions.fix) {
      await pkg.save();
    }

    const diff = await import('microdiff');

    const depsDiff = diff.default(
      ogDeps as any,
      pkg.content.dependencies as any,
    );
    const devDepsDiff = diff.default(
      ogDevDeps as any,
      pkg.content.devDependencies as any,
    );

    /**
     * Logs the differences in a changeset with a specified type.
     *
     * @param {any[]} changeset - An array of changes to be logged. Each change should have a 'type', 'path', 'oldValue', and 'value'.
     * @param {string} type - A string indicating the type of changeset being logged.
     */
    function logDiff(changeset: any[], type: string) {
      if (changeset.length) {
        logger.info(chalk.bold.dim`  ${type} changeset:`);
        changeset.forEach(it => {
          switch (it.type) {
            case 'CHANGE':
              logger.info(chalk.red`        --${it.path}@${it.oldValue}`);
              logger.info(chalk.green`        ++${it.path}@${it.value}`);
              break;
            case 'CREATE':
              logger.info(chalk.green`        ++${it.path}@${it.value}`);
              break;
            case 'REMOVE':
              logger.info(chalk.red`        --${it.path}@${it.oldValue}`);
              break;
          }
          logger.info('');
        });
      }
    }

    logDiff(depsDiff, 'dependencies');
    logDiff(devDepsDiff, 'devDependencies');
  },
);
