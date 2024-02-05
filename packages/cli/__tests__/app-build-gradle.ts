/**
 * @jest-environment-options {"requireTemplate": true}
 */

/// <reference types="@brandingbrand/code-jest-config" />

import { type BuildConfig, fs, path } from "@brandingbrand/code-cli-kit";

import transformer from "../src/transformers/android/app-build-gradle";

describe("build.gradle transformers", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should update namespace, applicationId, versionCode and versionName", async () => {
    const config = {
      ...__flagship_code_build_config,
    } as BuildConfig;

    config.android.versioning = {
      build: 3,
      version: "1.3",
    };

    await transformer.transform(config, {} as any);
    const content = await fs.readFile(path.android.appBuildGradle, "utf-8");

    expect(content).toContain('namespace "com.brandingbrand"');
    expect(content).toContain('applicationId "com.brandingbrand"');
    expect(content).toContain("versionCode 3");
    expect(content).toContain('versionName "1.3"');
  });

  it("should add dependency to dependencies object", async () => {
    const config = {
      ...__flagship_code_build_config,
    } as BuildConfig;
    config.android.gradle = {
      appGradle: {
        dependencies: ['classpath("com.brandingbrand.tools.build:gradle")'],
      },
    };

    await transformer.transform(config, {} as any);
    const content = await fs.readFile(path.android.appBuildGradle, "utf-8");

    expect(content).toContain(`dependencies {
    classpath("com.brandingbrand.tools.build:gradle")`);
  });
});
