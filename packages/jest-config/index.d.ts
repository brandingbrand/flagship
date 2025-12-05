/**
 * Global variable to store the fixture path for Jest tests.
 *
 * @global
 * @type {string | undefined}
 */
declare global {
  /**
   * Global variable to store the fixture path for Jest tests.
   *
   * Will only exist if `requireTemplate` is `true` in the test environment options.
   */
  var __flagship_code_fixture_path: string | undefined;

  /**
   * Global variable to store the build configuration for the project.
   *
   * Will only exist if `requireTemplate` is `true` in the test environment options.
   *
   * @global
   * @type {unknown}
   */
  var __flagship_code_build_config: any;

  /**
   * resets the generated fixture directory to it's original state.
   *
   * Will only exist if `requireTemplate` is `true` in the test environment options.
   *
   * @global
   * @function
   */
  var resetFixture: () => Promise<void>;
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
