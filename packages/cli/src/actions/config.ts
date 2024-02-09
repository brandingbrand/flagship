import {
  FlagshipCodeConfigSchema,
  fs,
  path,
} from "@brandingbrand/code-cli-kit";
import { isLeft } from "fp-ts/lib/Either";

import { bundleRequire, config, defineAction } from "@/lib";

/**
 * Defines an action to handle configuration loading, decoding, and verification.
 *
 * @returns {Promise<string>} A Promise that resolves with a message indicating successful loading and verification of configuration.
 * @throws {Error} Throws an error if configuration file or build path is not found, or if the configuration does not match expected types.
 */
export default defineAction(async () => {
  // Check if flagship-code.config.ts file exists
  if (
    !(await fs.doesPathExist(path.project.resolve("flaghsip-code.config.ts")))
  ) {
    throw Error(
      "[ConfigActionError]: cannot find flagship-code.config.ts, be sure this exists in the root of your project."
    );
  }

  // Load flagship-code.config.ts file
  const flagshipCodeConfig = await bundleRequire(
    path.project.resolve("flagship-code.config.ts")
  );

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
    config.options.build
  );

  // Check if the build path exists
  if (!(await fs.doesPathExist(buildPath))) {
    throw Error(
      `[ConfigActionError]: cannot find build path: ${buildPath} for build ${config.options.build}`
    );
  }

  // Load the build configuration
  config.build = await bundleRequire(path.project.resolve(buildPath));

  // Return a success message
  return `found and verified flagship-code.config.ts and build.${config.options.build}.ts`;
}, "config");
