import {
  BuildConfig,
  PrebuildOptions,
  string,
} from '@brandingbrand/code-cli-kit';

/**
 * Configuration object for modifying MainApplication.kt files
 */
export default {
  /**
   * Regular expression pattern to match MainApplication.kt files
   * @type {RegExp} Regular expression matching MainApplication.kt files
   */
  __test: /\bMainApplication\.kt$/gm,

  /**
   * Function to add packages to the MainApplication.kt file
   * @param {string} content - The content of the MainApplication.kt file
   * @param {BuildConfig} config - Build configuration options
   * @param {PrebuildOptions} options - Prebuild configuration options
   * @returns {string} Modified file content with additional packages added
   */
  packages: (
    content: string,
    config: BuildConfig,
    options: PrebuildOptions,
  ): string => {
    return string.replace(
      content,
      /(PackageList\(.*)\n(\s\s+)/m,
      `$1
$2add(NativeConstantsPackage())
$2add(EnvSwitcherPackage())
$2`,
    );
  },
};
