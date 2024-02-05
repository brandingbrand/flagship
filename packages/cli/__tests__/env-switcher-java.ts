/**
 * @jest-environment-options {"requireTemplate": true}
 */

/// <reference types="@brandingbrand/code-jest-config/@types/globals.d.ts" />

import { type BuildConfig, fs, path } from "@brandingbrand/code-cli-kit";

import transformer from "../src/transformers/android/env-switcher-java";

describe("EnvSwitcher.java transformers", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should not update EnvSwitcher.java with initialEnvName to staging", async () => {
    const config = {
      ...__flagship_code_build_config,
    } as BuildConfig;

    config.android.packageName = "com.app";

    await transformer.transform(config, { env: "staging" } as any);
    const content = await fs.readFile(
      path.android.envSwitcher(config),
      "utf-8"
    );

    expect(content).toContain('final String initialEnvName = "staging";');
  });
});
