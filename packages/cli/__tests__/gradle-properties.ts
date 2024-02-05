/**
 * @jest-environment-options {"requireTemplate": true}
 */

/// <reference types="@brandingbrand/code-jest-config/@types/globals.d.ts" />

import { type BuildConfig, fs, path } from "@brandingbrand/code-cli-kit";

import transformer from "../src/transformers/android/gradle-properties";

describe("build.gradle transformers", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should not update useAndroidX, enableJetifier, FLIPPER_VERSION, reactNativeArchitectures, newArchEnabled and hermesEnabled", async () => {
    const config = {
      ...__flagship_code_build_config,
    } as BuildConfig;

    const orgininalContent = await fs.readFile(
      path.android.gradleProperties,
      "utf-8"
    );

    await transformer.transform(config, {} as any);
    const content = await fs.readFile(path.android.gradleProperties, "utf-8");

    expect(content).toEqual(orgininalContent);
  });

  it("should update useAndroidX, enableJetifier, FLIPPER_VERSION, reactNativeArchitectures, newArchEnabled and hermesEnabled", async () => {
    const config = {
      ...__flagship_code_build_config,
    } as BuildConfig;

    config.android.gradle = {
      properties: {
        useAndroidX: false,
        enableJetifier: false,
        FLIPPER_VERSION: "1.190.1",
        reactNativeArchitectures: "arm64",
        newArchEnabled: true,
        hermesEnabled: false,
      },
    };

    await transformer.transform(config, {} as any);
    const content = await fs.readFile(path.android.gradleProperties, "utf-8");

    expect(content).toContain("android.useAndroidX=false");
    expect(content).toContain("android.enableJetifier=false");
    expect(content).toContain("FLIPPER_VERSION=1.190.1");
    expect(content).toContain("reactNativeArchitectures=arm64");
    expect(content).toContain("newArchEnabled=true");
    expect(content).toContain("hermesEnabled=false");
  });
});
