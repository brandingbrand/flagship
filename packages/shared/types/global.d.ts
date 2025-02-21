/**
 * Global type declarations for Flagship Code configuration variables.
 * These declarations extend the global scope to include configuration objects
 * used throughout the Flagship Code build system.
 */
declare global {
  /**
   * Global configuration object for Flagship Code.
   * Contains core settings and configuration options for the Flagship Code CLI and runtime.
   */
  var __FLAGSHIP_CODE_CONFIG: import('@brandingbrand/code-cli-kit').CodeConfig;

  /**
   * Build-specific configuration object for Flagship Code.
   * Contains settings and options specifically related to the build process,
   * including compilation, bundling, and deployment configurations.
   */
  var __FLAGSHIP_CODE_BUILD_CONFIG: import('@brandingbrand/code-cli-kit').BuildConfig;
}

export {};
