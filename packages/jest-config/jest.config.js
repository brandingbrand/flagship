/**
 * Configuration for Jest using the 'ts-jest' preset.
 *
 * @type {import('ts-jest').JestConfigWithTsJest}
 */
module.exports = {
  /**
   * Use the 'ts-jest' preset for TypeScript support in Jest.
   *
   * @remarks
   * This preset provides TypeScript support for Jest.
   *
   * @type {string}
   */
  preset: "ts-jest",

  /**
   * Set the test environment for Jest.
   *
   * @remarks
   * The specified test environment is used to run the tests.
   *
   * @type {string}
   */
  testEnvironment: "@repo/jest-config/src/test-environment.ts",

  /**
   * Setup files to be executed after Jest environment setup.
   *
   * @remarks
   * These files are executed before each test suite.
   *
   * @type {string[]}
   */
  setupFilesAfterEnv: ["@repo/jest-config/src/setup-files-after-env.ts"],

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
    "^@/(.*)$": "./src/$1",
  },
};
