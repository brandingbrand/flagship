/**
 * @jest-environment-options {"requireTemplate": true}
 */

/// <reference types="@brandingbrand/code-jest-config/@types/globals.d.ts" />

import { type BuildConfig, fs, path } from "@brandingbrand/code-cli-kit";

import transformer from "../src/transformers/android/native-constants-java";

describe("NativeConstants.java transformers", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should update NativeConstants.java ShowDevMenu to false", async () => {
    const config = {
      ...__flagship_code_build_config,
    } as BuildConfig;

    config.android.packageName = "com.app";

    await transformer.transform(config, { release: true } as any);
    const content = await fs.readFile(
      path.android.nativeConstants(config),
      "utf-8"
    );

    expect(content).toContain('constants.put("ShowDevMenu", "false");');
  });
});
