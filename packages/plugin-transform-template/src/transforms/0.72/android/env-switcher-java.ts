import {
  BuildConfig,
  PrebuildOptions,
  string,
} from '@brandingbrand/code-cli-kit';

/**
 * Configuration for handling environment switching in Java files.
 * @exports
 */
export default {
  /**
   * Regular expression to match EnvSwitcher.java files
   * @type {RegExp}
   */
  __test: /\bEnvSwitcher\.java$/gm,

  /**
   * Updates the initialEnvName value in matched files with the environment from options.
   *
   * @param {string} content - The file content to process
   * @param {BuildConfig} config - Build configuration object
   * @param {PrebuildOptions} options - Prebuild options containing environment info
   * @returns {string} The updated file content with new environment value
   */
  initialEnvName: (
    content: string,
    config: BuildConfig,
    options: PrebuildOptions,
  ): string => {
    return string.replace(
      content,
      /(initialEnvName = ").*(")/m,
      `$1${options.env}$2`,
    );
  },
};
