import {definePlugin, logger, path} from '@brandingbrand/code-cli-kit';
import {PackageJson} from 'type-fest';

import plugins from './packages';
import {EnvPackagePluginConfig} from './utils';

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

let activePlugins: EnvPackagePluginConfig[] | undefined;
export default definePlugin({
  common: async (build, options) => {
    logger.info('Configuring runtime environment provider.');

    // Determine which plugin to use based on the presence of a supported package in the project's package.json
    const projectDeps = loadProjectDependencyList();
    activePlugins = Object.values(plugins).filter(it =>
      projectDeps.includes(it.package),
    );

    // Ensure we have exactly one plugin candidate
    // If none are found, then we don't need to take any further action
    if (activePlugins.length === 0) {
      logger.debug(
        'No compatible runtime environment provider found. Skipping.',
      );
      return;
    }

    // If multiple are found, we throw an error to prevent this situation,
    // as it is extremely poor practice to run multiple.
    if (activePlugins.length > 1) {
      const packageNames = activePlugins.map(it => it.package).join(', ');
      logger.warn(
        `Multiple runtime environment providers found:
  ${packageNames}
  Multiple providers are allowed, but highly discouraged.
  Consider consolidating your ENV variables into one provider, and removing all others.`,
      );
    }

    await Promise.allSettled(
      activePlugins.map(it => it.common?.(build, options)),
    );
  },
  // 'common' is always ran before platform specific functions, so we use the common function determine active plugin
  // and ensure it's set before running platform specific functions, if they exist. We silently skip if no function exists.
  ios: async (build, options) => {
    await Promise.allSettled(
      activePlugins?.map(it => it.ios?.(build, options)) || [],
    );
  },
  android: async (build, options) => {
    await Promise.allSettled(
      activePlugins?.map(it => it.android?.(build, options)) || [],
    );
  },
});
