import {definePlugin} from '@brandingbrand/code-cli-kit';

/**
 * Defines a Flagship™ Code `prebuild` plugin.
 *
 * Code plugins are intended to encapsulate native code transformations,
 * but may also be used to peform any setup task your project requires.
 *
 * Plugin functions are always executed sequentially in the following order:
 * 1. `common` - platform-agnostic code
 * 2. `ios` - iOS-specific code
 * 3. `android` - Android-specific code
 *
 * Platform functions may not always be executed, depending on the prebuild `--platform` argument.
 *
 * Avoid executing platform-specific tasks outside of their respective platform functions.
 * Failure to maintain this separation may lead to build failures or unexpected behavior.
 *
 * Each function receives the same parameters:
 * - `build`: The current build configuration object.
 * - `options`: The CLI options provided to the prebuild command.
 * - `codeConfig`: The project's 'flagship-code.config.ts' file.
 */
export default definePlugin({
  /**
   * Common function to be executed for all platforms
   */
  common: async function (build, options, codeConfig): Promise<void> {},
  /**
   * Function to be executed for iOS platform.
   */
  ios: async function (build, options, codeConfig): Promise<void> {},
  /**
   * Function to be executed for Android platform.
   */
  android: async function (build, options, codeConfig): Promise<void> {},
});
