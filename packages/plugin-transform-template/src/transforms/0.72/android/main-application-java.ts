import {
  BuildConfig,
  PrebuildOptions,
  string,
} from '@brandingbrand/code-cli-kit';

/**
 * Configuration for Java MainApplication file manipulation
 * @exports Default configuration object
 */
export default {
  /** Regular expression to match MainApplication.java files */
  __test: /\bMainApplication\.java$/gm,

  /**
   * Adds additional package declarations to the MainApplication.java file
   * @param content - The content of the MainApplication.java file
   * @param config - Build configuration options
   * @param options - Prebuild options for the build process
   * @returns Modified file content with added package declarations
   */
  packages: (
    content: string,
    config: BuildConfig,
    options: PrebuildOptions,
  ): string => {
    return string.replace(
      content,
      /(new PackageList.*\s+)/m,
      `$1packages.add(new NativeConstantsPackage());
            packages.add(new EnvSwitcherPackage());
            `,
    );
  },
};
