import fs from "fs";
import path from "path";
import fse from "fs-extra";
import { TestEnvironment } from "jest-environment-node";

import type {
  EnvironmentContext,
  JestEnvironmentConfig,
} from "@jest/environment";
import type { Config } from "../../src/types/Config";

class CustomEnvironment extends TestEnvironment {
  options: Record<string, unknown>;
  testPath: string;

  constructor(config: JestEnvironmentConfig, context: EnvironmentContext) {
    super(config, context);

    this.options = config.projectConfig.testEnvironmentOptions;
    this.testPath = context.testPath;
  }

  async setup() {
    const { fixture, additionalDirectory } = this.options;

    if (!fixture) return super.setup();

    const fixturePath = path.resolve(
      path.dirname(this.testPath),
      fixture as string
    );

    await fs.promises.mkdir(fixturePath);
    await fse.copy(
      path.resolve(__dirname, "..", "..", "src", "template"),
      fixturePath
    );

    if (additionalDirectory) {
      await fse.copy(
        path.resolve(
          path.dirname(this.testPath),
          additionalDirectory as string
        ),
        fixturePath
      );
    }

    this.global.__FLAGSHIP_CODE_FIXTURE_PATH__ = fixturePath;
    this.global.__FLAGSHIP_CODE_CONFIG__ = {
      ios: {
        name: "HelloWorld",
        bundleId: "com.helloworld",
        displayName: "Hello World",
        versioning: {
          version: "1.0.0",
          build: 1,
        },
      },
      android: {
        name: "HelloWorld",
        displayName: "Hello World",
        packageName: "com.helloworld",
        versioning: {
          version: "1.0.0",
          build: 1,
        },
      },
      app: {},
      release: false,
    } as Config;

    await super.setup();
  }

  async teardown() {
    const { fixture } = this.options;

    if (!fixture) return super.teardown();

    await fs.promises.rm(
      path.resolve(path.dirname(this.testPath), fixture as string),
      { recursive: true }
    );

    await super.teardown();
  }

  getVmContext() {
    return super.getVmContext();
  }
}

export = CustomEnvironment;
