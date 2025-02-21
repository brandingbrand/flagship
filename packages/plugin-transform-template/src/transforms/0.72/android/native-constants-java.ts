import {
  BuildConfig,
  PrebuildOptions,
  string,
} from '@brandingbrand/code-cli-kit';

/**
 * Configuration for handling the native constants file and dev menu settings
 * @returns Object containing test pattern and showDevMenu function
 */
export default {
  /**
   * Regular expression to match NativeConstants.java files
   */
  __test: /\bNativeConstants\.java$/gm,

  /**
   * Updates the ShowDevMenu setting in the native constants file based on build options
   * @param content - The content of the native constants file
   * @param config - Build configuration object
   * @param options - Prebuild options containing release flag
   * @returns Updated file content with modified ShowDevMenu setting
   */
  showDevMenu: (
    content: string,
    config: BuildConfig,
    options: PrebuildOptions,
  ): string => {
    return string.replace(
      content,
      /(ShowDevMenu",\s*").*(")/m,
      `$1${!options.release}$2`,
    );
  },
};
