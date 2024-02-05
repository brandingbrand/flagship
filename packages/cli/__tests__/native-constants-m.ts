/**
 * @jest-environment-options {"requireTemplate": true}
 */

/// <reference types="@brandingbrand/code-jest-config" />

import { type BuildConfig, fs, path } from "@brandingbrand/code-cli-kit";

import transformer from "../src/transformers/ios/native-constants-m";

describe("NativeConstants.java transformers", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should update NativeConstants.m ShowDevMenu to false", async () => {
    const config = {
      ...__flagship_code_build_config,
    } as BuildConfig;

    await transformer.transform(config, { release: true } as any);
    const content = await fs.readFile(path.ios.nativeConstants, "utf-8");

    expect(content).toContain('@"ShowDevMenu": @"false"');
  });
});
