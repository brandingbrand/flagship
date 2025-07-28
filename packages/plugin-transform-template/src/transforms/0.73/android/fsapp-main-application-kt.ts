import {
  BuildConfig,
  PrebuildOptions,
  string,
} from '@brandingbrand/code-cli-kit';

const MainApplicationRegex = /\bMainApplication\.kt$/gm;

/**
 * Configuration object for modifying MainApplication.kt files
 */
export default {
  /** Test to match MainApplication.kt files in projects that use FSApp */
  __test: (destFile: string, deps: string[]) =>
    MainApplicationRegex.test(destFile) &&
    deps.includes('@brandingbrand/fsapp'),

  /**
   * Function to add packages to the MainApplication.kt file
   * @param {string} content - The content of the MainApplication.kt file
   * @param {BuildConfig} config - Build configuration options
   * @param {PrebuildOptions} options - Prebuild configuration options
   * @returns {string} Modified file content with additional packages added
   */
  addFSAppPackages: (
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
