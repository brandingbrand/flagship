import {
  BuildConfig,
  PrebuildOptions,
  string,
} from '@brandingbrand/code-cli-kit';

const MainApplicationRegex = /\bMainApplication\.java$/gm;

/**
 * Configuration for Java MainApplication file manipulation
 * @exports Default configuration object
 */
export default {
  /** Test to match MainApplication.java files in projects that use FSApp */
  __test: (destFile: string, deps: string[]) =>
    MainApplicationRegex.test(destFile) &&
    deps.includes('@brandingbrand/fsapp'),

  /**
   * Adds additional package declarations to the MainApplication.java file
   * @param content - The content of the MainApplication.java file
   * @param config - Build configuration options
   * @param options - Prebuild options for the build process
   * @returns Modified file content with added package declarations
   */
  addFSAppPackages: (
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
