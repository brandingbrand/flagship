import {getReactNativeVersion} from '@brandingbrand/code-cli-kit';
import PackageJson from '@npmcli/package-json';
import semver from 'semver';

import {defineAction} from '@/lib';
import {profiles, Profile} from '@/lib/profiles';

export default defineAction(
  async (): Promise<void> => {
    const pkg = await PackageJson.load(process.cwd());
    const reactNativeVersion = getReactNativeVersion();

    if (!(reactNativeVersion in profiles)) {
      throw new Error(
        `Unsupported React Native version: ${reactNativeVersion}`,
      );
    }

    const reactNativeProfile =
      profiles[reactNativeVersion as keyof typeof profiles];

    function verifyDependency(dependency: string, profile: Profile) {
      const version =
        pkg.content?.[profile.devOnly ? 'devDependencies' : 'dependencies']?.[
          dependency
        ];

      if (
        (!version ||
          !semver.satisfies(
            semver.coerce(version) || version,
            profile.version,
          )) &&
        !profile.banned
      ) {
        pkg.update({
          ...(profile.devOnly
            ? {
                devDependencies: {
                  ...(pkg.content.devDependencies as any),
                  [dependency]: profile.version,
                },
              }
            : {
                dependencies: {
                  ...(pkg.content.dependencies as any),
                  [dependency]: profile.version,
                },
              }),
        });
      }

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

      if (profile.capabilities) {
        return profile.capabilities.forEach(it =>
          verifyDependency(it, reactNativeProfile[it] as Profile),
        );
      }
    }

    Object.entries(reactNativeProfile)
      .filter(([_key, value]) => value.required)
      .forEach(([key, value]) => {
        verifyDependency(key, value);
      });

    Object.entries(reactNativeProfile)
      .filter(([_key, value]) => !value.required)
      .filter(([key, _value]) =>
        Object.keys({
          ...pkg.content.dependencies,
          ...pkg.content.devDependencies,
        }).includes(key),
      )
      .forEach(([key, value]) => {
        verifyDependency(key, value);
      });

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
