import type {
  EnvironmentContext,
  JestEnvironmentConfig,
} from "@jest/environment";
import { TestEnvironment } from "jest-environment-node";
import fse from "fs-extra";
import path from "path";
import temp from "temp";

class CustomEnvironment extends TestEnvironment {
  options: Record<string, unknown>;
  testPath: string;

  constructor(config: JestEnvironmentConfig, context: EnvironmentContext) {
    super(config, context);
    this.options = config.projectConfig.testEnvironmentOptions;
    this.testPath = context.testPath;

    temp.track();
  }

  async setup() {
    const { requireTemplate, fixtures } = this.options;

    if (!requireTemplate) return super.setup();

    const dir = temp.mkdirSync();
    const templatePath = path.resolve(
      __dirname,
      "..",
      "packages",
      "cli",
      "template"
    );

    if (fixtures && typeof fixtures === "string") {
      await fse.copy(path.resolve(this.testPath, fixtures), dir);
    }

    await fse.mkdir(path.resolve(dir, "ios"));
    await fse.mkdir(path.resolve(dir, "android"));

    await fse.copy(path.resolve(templatePath, "ios"), path.resolve(dir, "ios"));
    await fse.copy(
      path.resolve(templatePath, "android"),
      path.resolve(dir, "android")
    );

    this.global.__flagship_code_fixture_path = dir;

    await super.setup();
  }

  async teardown() {
    const { requireTemplate } = this.options;

    if (!requireTemplate) return super.teardown();

    temp.cleanupSync();

    await super.teardown();
  }

  getVmContext() {
    return super.getVmContext();
  }
}

export = CustomEnvironment;
