/**
 * @jest-environment-options {"requireTemplate": true}
 */

/// <reference types="@brandingbrand/code-jest-config/@types/globals.d.ts" />

import { type BuildConfig, fs, path } from "@brandingbrand/code-cli-kit";

import transformer from "../src/transformers/android/build-gradle";

describe("build.gradle transformers", () => {
  const config: BuildConfig = __flagship_code_build_config;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("", async () => {
    config.android.gradle = {
      projectGradle: {
        compileSdkVersion: 35,
        targetSdkVersion: 38,
      },
    };

    await transformer.transform(config);
    const content = await fs.readFile(path.android.buildGradle, "utf-8");

    expect(content).toContain("compileSdkVersion = 35");
    expect(content).toContain("targetSdkVersion = 38");
  });
});
