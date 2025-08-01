import {definePlugin, logger, path} from '@brandingbrand/code-cli-kit';
import {PackageJson} from 'type-fest';

import {packageTransforms} from './packages';

/**
 * Retrieves a list of all dependencies (both regular and dev) from the project's package.json
 */
const loadProjectDependencyList = (): string[] => {
  const pkgJson = require(path.project.resolve('package.json')) as PackageJson;
  if (!pkgJson) {
    throw new Error(
      'Unable to parse project package.json. Ensure it exists and is valid.',
    );
  }

  return [
    ...Object.keys(pkgJson.dependencies || {}),
    ...Object.keys(pkgJson.devDependencies || {}),
  ];
};

const projectDeps = loadProjectDependencyList();
const activeTransforms = (
  Object.keys(packageTransforms) as (keyof typeof packageTransforms)[]
).filter(it => projectDeps.includes(it));

export default definePlugin({
  common: async (build, options) => {
    logger.info('Configuring runtime environment provider.');

    // Ensure we have exactly one plugin candidate
    // If none are found, then we don't need to take any further action
    if (activeTransforms.length === 0) {
      logger.debug(
        'No compatible runtime environment provider found. Skipping.',
      );
      return;
    }

    // Multiple plugins are allowed, but log a warning about it.
    // as it is extremely poor practice to run multiple.
    if (activeTransforms.length > 1) {
      const packageNames = activeTransforms.join(', ');
      logger.warn(
        `Multiple runtime environment providers found:
  ${packageNames}
  Multiple providers are allowed, but highly discouraged.
  Consider consolidating your ENV variables into one provider, and removing all others.`,
      );
    }

    for (const transformName of activeTransforms) {
      await packageTransforms[transformName].common?.(build, options);
    }
  },

  // 'common' is always ran before platform specific functions, so we use the common function determine active plugin
  // and ensure it's set before running platform specific functions, if they exist. We silently skip if no function exists.
  ios: async (build, options) => {
    for (const transformName of activeTransforms) {
      await packageTransforms[transformName].ios?.(build, options);
    }
  },

  android: async (build, options) => {
    for (const transformName of activeTransforms) {
      await packageTransforms[transformName].android?.(build, options);
    }
  },
});

export * from './types';
