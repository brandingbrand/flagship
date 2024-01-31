/**
 * Global variable to store the fixture path for Jest tests.
 *
 * @global
 * @type {string | undefined}
 */
declare global {
  var __flagship_code_fixture_path: string | undefined;

  /**
   * Global variable to store the build configuration for the project.
   *
   * @global
   * @type {import("@brandingbrand/code-cli-kit").BuildConfig | undefined}
   */
  var __flagship_code_build_config:
    | import("@brandingbrand/code-cli-kit").BuildConfig
    | undefined;
}

/**
 * Export an empty object to ensure proper module augmentation in TypeScript.
 *
 * @remarks
 * This export statement is needed to allow merging declarations with the global scope.
 * Without it, TypeScript will not recognize the global variable declarations.
 *
 * @example
 * ```typescript
 * // Use an empty export to allow merging with global declarations
 * export {};
 * ```
 */
export {};
