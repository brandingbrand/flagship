import {getReactNativeVersion} from '@brandingbrand/code-cli-kit';
import PackageJson from '@npmcli/package-json';
import semver from 'semver';

import {defineAction} from '@/lib';
import {profiles, Profile} from '@/lib/profiles';

/**
 * Updates dependencies in package.json based on the specified React Native profile.
 */
export default defineAction(
  /**
   * Main function to verify and update package dependencies.
   * @returns {Promise<void>} A promise that resolves when the action is complete.
   */
  async (): Promise<void> => {
    const pkg = await PackageJson.load(process.cwd());
    const reactNativeVersion = getReactNativeVersion();

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
     * Verifies and updates a dependency based on the given profile.
     * @param {string} dependency - The name of the dependency.
     * @param {Profile} profile - The profile specifying the version and other details for the dependency.
     */
    function verifyDependency(dependency: string, profile: Profile) {
      if (executedProfiles.includes(dependency)) return;

      executedProfiles.push(dependency);

      const version =
        pkg.content?.[profile.devOnly ? 'devDependencies' : 'dependencies']?.[
          dependency
        ];
      const pkgKey = profile.devOnly ? 'devDependencies' : 'dependencies';

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
      if (profile.capabilities) {
        return profile.capabilities.forEach(it =>
          verifyDependency(it, reactNativeProfile[it] as Profile),
        );
      }
    }

    // Verify required dependencies
    Object.entries(reactNativeProfile)
      .filter(([_key, value]) => value.required)
      .forEach(([key, value]) => {
        verifyDependency(key, value);
      });

    // Verify non-required dependencies that are already in package.json
    Object.entries(reactNativeProfile)
      .filter(([key, _value]) => !executedProfiles.includes(key))
      .filter(([key, _value]) =>
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

    await pkg.save();
  },
  'dependencies',
  'template',
);
