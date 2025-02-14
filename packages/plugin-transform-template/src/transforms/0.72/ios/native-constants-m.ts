import {
  BuildConfig,
  PrebuildOptions,
  string,
} from '@brandingbrand/code-cli-kit';

/**
 * Module for managing native constants and development menu settings
 */
export default {
  /**
   * Regular expression test pattern to match NativeConstants.m files
   */
  __test: /\bNativeConstants\.m$/gm,

  /**
   * Updates the ShowDevMenu setting in the native constants file based on build options
   *
   * @param content - The content of the NativeConstants.m file to modify
   * @param config - Build configuration options (currently unused)
   * @param options - Prebuild options containing release flag
   * @returns The modified file content with updated ShowDevMenu setting
   *
   * @remarks
   * This function uses regex to find and replace the ShowDevMenu value,
   * setting it to the inverse of options.release (true in debug, false in release)
   */
  showDevMenu: (
    content: string,
    config: BuildConfig,
    options: PrebuildOptions,
  ): string => {
    return string.replace(
      content,
      /(ShowDevMenu":\s+@").*(")/m,
      `$1${!options.release}$2`,
    );
  },
};
