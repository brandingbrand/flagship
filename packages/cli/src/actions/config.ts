import semver from 'semver';
import {
  BuildConfig,
  BuildConfigSchema,
  FlagshipCodeConfigSchema,
  Plugin,
  fs,
  logger,
  path,
} from '@brandingbrand/code-cli-kit';
import {isLeft} from 'fp-ts/lib/Either';
import {mergeAndConcat} from 'merge-anything';

import {
  bundleRequire,
  config,
  defineAction,
  isGenerateCommand,
  REACT_NATIVE_VERSION_RANGE,
  REACT_VERSION_RANGE,
} from '@/lib';

/**
 * Defines an action to handle configuration loading, decoding, and verification.
 *
 * @returns {Promise<string>} A Promise that resolves with a message indicating successful loading and verification of configuration.
 * @throws {Error} Throws an error if configuration file or build path is not found, or if the configuration does not match expected types.
 */
export default defineAction(async () => {
  // Gather the react-native and react versions.
  const {version: reactNativeVersion} = require(
    require.resolve('react-native/package.json', {
      paths: [process.cwd()],
    }),
  );
  const {version: reactVersion} = require(
    require.resolve('react/package.json', {
      paths: [process.cwd()],
    }),
  );

  // Validate the installed version of React Native against the required semantic version range.
  // Throws an error if the installed version does not satisfy the required range.
  if (!semver.satisfies(reactNativeVersion, REACT_NATIVE_VERSION_RANGE)) {
    throw Error(
      `Version Mismatch: react-native version must match ${REACT_NATIVE_VERSION_RANGE}, the installed version is ${reactNativeVersion}.`,
    );
  }

  // Validate the installed version of React against the required semantic version range.
  // Throws an error if the installed version does not satisfy the required range.
  if (!semver.satisfies(reactVersion, REACT_VERSION_RANGE)) {
    throw Error(
      `Version Mismatch: react version must match ${REACT_VERSION_RANGE}, the installed version is ${reactVersion}.`,
    );
  }

  // Check if flagship-code.config.ts file exists
  if (
    !(await fs.doesPathExist(path.project.resolve('flagship-code.config.ts')))
  ) {
    throw Error(
      'Unknown File: cannot find flagship-code.config.ts, be sure this exists in the root of your project.',
    );
  }

  // Load flagship-code.config.ts file with default export
  const flagshipCodeConfig = (
    await bundleRequire(path.project.resolve('flagship-code.config.ts'))
  ).default;

  // Decode and validate flagshipCodeConfig against FlagshipCodeConfigSchema
  const decodedFlagshipCodeConfig =
    FlagshipCodeConfigSchema.decode(flagshipCodeConfig);

  // Check if decoding is successful
  if (isLeft(decodedFlagshipCodeConfig)) {
    throw new Error(
      'Type Mismatch: flagship-code.config.ts object does not match expected types, please check for typescript errors in flagship-code.config.ts',
    );
  }

  logger.log('validated flagshp-code.config.ts configuration file');

  // Set the decoded configuration to the global config object
  config.code = decodedFlagshipCodeConfig.right;

  // Short-circuit return as the rest of the action is prebuild command related
  // WARNING: Consider moving this in future.
  if (isGenerateCommand()) return;

  // Resolve the build path based on the configuration
  const buildPath = path.project.resolve(
    config.code.buildPath,
    `build.${config.options.build}.ts`,
  );

  // Check if the build path exists
  if (!(await fs.doesPathExist(buildPath))) {
    throw Error(
      `Unknown Path: cannot find build path: ${buildPath} for build: ${config.options.build}`,
    );
  }

  // Load the build configuration
  const buildConfig = (await bundleRequire(path.project.resolve(buildPath)))
    .default;

  // Decode and validate buildConfig against BuildConfigSchema
  const decodedBuildConfig = BuildConfigSchema.decode(buildConfig);

  // Check if decoding is successful
  if (isLeft(decodedBuildConfig)) {
    throw new Error(
      `Type Mismatch: build.${config.options.build}.ts object does not match expected types, please check for typescript errors in build.${config.options.build}.ts`,
    );
  }

  logger.log(`validated build.${config.options.build}.ts configuration file`);

  // Set the decoded configuration to the global config object
  config.build = decodedBuildConfig.right;

  /**
   * Merges build configuration object excluding 'ios' and 'android' keys.
   * Use-case for plugins extending the build configuration within their
   * own object. This it much simpler to remove plugins when no longer used.
   */
  const mergedBuildConfig = Object.entries(config.build)
    // Filter out entries with keys 'ios' and 'android'.
    .filter(([key]) => key !== 'ios' && key !== 'android')
    // Filter out entries without 'ios' or 'android' properties.
    .filter(
      ([_, value]) =>
        !!(value as unknown as Plugin<unknown>).ios ||
        !!(value as unknown as Plugin<unknown>).android,
    )
    // Reduce the array of filtered entries to a single merged object.
    .reduce((acc, [_, value]) => {
      // Destructure 'plugin' property and rename remaining properties as 'pluginBuildconfig'.
      const {plugin, ...pluginBuildconfig} =
        value as unknown as Plugin<unknown>;

      // Merge the accumulated configuration with the plugin build configuration.
      return mergeAndConcat(acc, pluginBuildconfig) as BuildConfig;
    }, config.build);

  // Set the merged build configuration to the global config object
  config.build = mergedBuildConfig;
});
