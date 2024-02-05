import type {
  EnvironmentContext,
  JestEnvironmentConfig,
} from "@jest/environment";
import { TestEnvironment } from "jest-environment-node";
import fse from "fs-extra";
import path from "path";
import temp from "temp";

/**
 * Custom Jest environment for testing purposes with additional setup and teardown logic.
 *
 * @extends TestEnvironment
 */
export default class CustomEnvironment extends TestEnvironment {
  /**
   * Options provided to the environment.
   *
   * @type {Record<string, unknown>}
   */
  options: Record<string, unknown>;

  /**
   * Path to the current test file.
   *
   * @type {string}
   */
  testPath: string;

  /**
   * Creates an instance of CustomEnvironment.
   *
   * @param {JestEnvironmentConfig} config - Jest environment configuration.
   * @param {EnvironmentContext} context - Environment context.
   */
  constructor(config: JestEnvironmentConfig, context: EnvironmentContext) {
    super(config, context);
    this.options = config.projectConfig.testEnvironmentOptions;
    this.testPath = context.testPath;

    // Initialize the temp directory tracker
    temp.track();
  }

  /**
   * Perform additional setup before each test suite.
   *
   * @returns {Promise<void>} A Promise that resolves once the setup is complete.
   */
  async setup() {
    const { requireTemplate, fixtures } = this.options;

    if (!requireTemplate) return super.setup();

    // Create a temporary directory
    const dir = temp.mkdirSync();
    const templatePath = path.join(
      require.resolve("@brandingbrand/code-cli/package.json"),
      "..",
      "template"
    );

    // Create "ios" and "android" directories
    await fse.mkdir(path.resolve(dir, "ios"));
    await fse.mkdir(path.resolve(dir, "android"));

    // Copy template files to the temporary directory
    await fse.copy(path.resolve(templatePath, "ios"), path.resolve(dir, "ios"));
    await fse.copy(
      path.resolve(templatePath, "android"),
      path.resolve(dir, "android")
    );

    // Copy fixtures if provided
    if (fixtures && typeof fixtures === "string") {
      await fse.copy(path.resolve(path.dirname(this.testPath), fixtures), dir);
    }

    // Set a global variable to store the fixture path
    this.global.__flagship_code_fixture_path = dir;

    // Continue with the regular Jest setup
    await super.setup();
  }

  /**
   * Perform additional teardown after each test suite.
   *
   * @returns {Promise<void>} A Promise that resolves once the teardown is complete.
   */
  async teardown() {
    const { requireTemplate } = this.options;

    if (!requireTemplate) return super.teardown();

    // Cleanup the temporary directory
    temp.cleanupSync();

    // Continue with the regular Jest teardown
    await super.teardown();
  }

  /**
   * Get the VM context.
   *
   * @returns {object} The VM context.
   */
  getVmContext() {
    return super.getVmContext();
  }
}
