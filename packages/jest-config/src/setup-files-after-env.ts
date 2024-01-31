/**
 * Conditionally sets the current working directory to a specified fixture path for Jest tests.
 * This is useful for testing scenarios where a specific fixture path needs to be used during testing.
 *
 * @example
 * ```typescript
 * if (global.__flagship_code_fixture_path) {
 *   jest.spyOn(process, "cwd").mockReturnValue(global.__flagship_code_fixture_path);
 * }
 * ```
 */
if (global.__flagship_code_fixture_path) {
  /**
   * Mocks the `process.cwd` function to return the specified fixture path.
   *
   * @type {jest.SpyInstance<string, []>}
   */
  jest
    .spyOn(process, "cwd")
    .mockReturnValue(global.__flagship_code_fixture_path);
}

/**
 * Global configuration object containing build settings for both iOS and Android platforms.
 */
global.__flagship_code_build_config = {
  ios: {
    name: "brandingbrand",
    bundleId: "com.brandingbrand",
    displayName: "Branding Brand",
  },
  android: {
    name: "brandingbrand",
    displayName: "Branding Brand",
    packageName: "com.brandingbrand",
  },
};
