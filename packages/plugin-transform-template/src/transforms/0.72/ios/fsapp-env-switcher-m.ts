import {
  BuildConfig,
  PrebuildOptions,
  string,
} from '@brandingbrand/code-cli-kit';

/**
 * Configuration object for environment name switching functionality.
 *
 * @exports
 * @default
 */
export default {
  /** Regular expression to match EnvSwitcher.m files */
  __test: /\bEnvSwitcher\.m$/gm,

  /**
   * Replaces the initialEnvName in matching files with the environment from options.
   *
   * @param {string} content - The file content to process
   * @param {BuildConfig} config - Build configuration object
   * @param {PrebuildOptions} options - Prebuild options containing the target environment
   * @returns {string} The processed content with updated environment name
   */
  initialEnvName: (
    content: string,
    config: BuildConfig,
    options: PrebuildOptions,
  ): string => {
    return string.replace(
      content,
      /(\*initialEnvName\s+=\s+@").*(")/m,
      `$1${options.env}$2`,
    );
  },
};
