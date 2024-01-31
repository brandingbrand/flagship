/**
 * Jest configuration extended with additional options.
 *
 * @type {import('ts-jest').JestConfigWithTsJest}
 */

module.exports = {
  /**
   * Merge the 'ts-jest' preset configuration.
   */
  ...require("ts-jest/jest-preset"),

  /**
   * Set the test environment for Jest.
   *
   * @remarks
   * The specified test environment is used to run the tests.
   *
   * @type {string}
   */
  testEnvironment: require.resolve("./src/test-environment.ts"),

  /**
   * Setup files to be executed after Jest environment setup.
   *
   * @remarks
   * These files are executed before each test suite.
   *
   * @type {string[]}
   */
  setupFilesAfterEnv: [require.resolve("./src/setup-files-after-env.ts")],

  /**
   * Module name mapper for path aliasing in Jest.
   *
   * @remarks
   * Maps module paths based on specified patterns.
   *
   * @type {Record<string, string>}
   */
  moduleNameMapper: {
    /**
     * Maps paths starting with '@/' to the 'src/' directory.
     *
     * @example
     * ```typescript
     * // Maps "@/components/button" to "./src/components/button"
     * "^@/(.*)$": "./src/$1",
     * ```
     */
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};
