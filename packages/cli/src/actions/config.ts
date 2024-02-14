import {
  BuildConfig,
  BuildConfigSchema,
  FlagshipCodeConfigSchema,
  Plugin,
  fs,
  path,
} from "@brandingbrand/code-cli-kit";
import { isLeft } from "fp-ts/lib/Either";

import { bundleRequire, config, defineAction } from "@/lib";
import { mergeAndConcat } from "merge-anything";

/**
 * Defines an action to handle configuration loading, decoding, and verification.
 *
 * @returns {Promise<string>} A Promise that resolves with a message indicating successful loading and verification of configuration.
 * @throws {Error} Throws an error if configuration file or build path is not found, or if the configuration does not match expected types.
 */
export default defineAction(async () => {
  // Check if flagship-code.config.ts file exists
  if (
    !(await fs.doesPathExist(path.project.resolve("flagship-code.config.ts")))
  ) {
    throw Error(
      "[ConfigActionError]: cannot find flagship-code.config.ts, be sure this exists in the root of your project."
    );
  }

  // Load flagship-code.config.ts file with default export
  const flagshipCodeConfig = (
    await bundleRequire(path.project.resolve("flagship-code.config.ts"))
  ).default;

  // Decode and validate flagshipCodeConfig against FlagshipCodeConfigSchema
  const decodedFlagshipCodeConfig =
    FlagshipCodeConfigSchema.decode(flagshipCodeConfig);

  // Check if decoding is successful
  if (isLeft(decodedFlagshipCodeConfig)) {
    throw new Error(
      "[ConfigActionError]: flagship-code.config.ts object does not match expected types, please check for typescript errors in flagship-code.config.ts"
    );
  }

  // Set the decoded configuration to the global config object
  config.code = decodedFlagshipCodeConfig.right;

  // Resolve the build path based on the configuration
  const buildPath = path.project.resolve(
    config.code.buildPath,
    `build.${config.options.build}.ts`
  );

  // Check if the build path exists
  if (!(await fs.doesPathExist(buildPath))) {
    throw Error(
      `[ConfigActionError]: cannot find build path: ${buildPath} for build: ${config.options.build}`
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
      `[ConfigActionError]: build.${config.options.build}.ts object does not match expected types, please check for typescript errors in build.${config.options.build}.ts`
    );
  }

  // Set the decoded configuration to the global config object
  config.build = decodedBuildConfig.right;

  /**
   * Merges build configuration object excluding 'ios' and 'android' keys.
   * Use-case for plugins extending the build configuration within their
   * own object. This it much simpler to remove plugins when no longer used.
   */
  const mergedBuildConfig = Object.entries(config.build)
    // Filter out entries with keys 'ios' and 'android'.
    .filter(([key]) => key !== "ios" && key !== "android")
    // Filter out entries without 'ios' or 'android' properties.
    .filter(
      ([_, value]) =>
        !!(value as unknown as Plugin<unknown>).ios ||
        !!(value as unknown as Plugin<unknown>).android
    )
    // Reduce the array of filtered entries to a single merged object.
    .reduce((acc, [_, value]) => {
      // Destructure 'plugin' property and rename remaining properties as 'pluginBuildconfig'.
      const { plugin, ...pluginBuildconfig } =
        value as unknown as Plugin<unknown>;

      // Merge the accumulated configuration with the plugin build configuration.
      return mergeAndConcat(acc, pluginBuildconfig) as BuildConfig;
    }, config.build);

  // Set the merged build configuration to the global config object
  config.build = mergedBuildConfig;

  // Return a success message
  return `found and verified flagship-code.config.ts and build.${config.options.build}.ts`;
}, "config");
