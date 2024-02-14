/**
 * @jest-environment-options {"requireTemplate": true}
 */

/// <reference types="@brandingbrand/code-jest-config" />

import { type BuildConfig, fs, path } from "@brandingbrand/code-cli-kit";

import transformer from "../src/transformers/android/main-application-java";

describe("MainApplication.java transformers", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should not update MainApplication.java with initialEnvName to staging", async () => {
    const config = {
      ...__flagship_code_build_config,
    } as BuildConfig;

    config.android.packageName = "com.app";

    await transformer.transform(config, {} as any);
    const content = await fs.readFile(
      path.android.mainApplication(config),
      "utf-8"
    );

    expect(content).toContain("packages.add(new NativeConstantsPackage());");
    expect(content).toContain("packages.add(new EnvSwitcherPackage());");
  });
});
