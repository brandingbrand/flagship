/**
 * @jest-environment-options {"requireTemplate": true, "fixtures": "gemfile_fixtures"}
 */

/// <reference types="@brandingbrand/code-jest-config/@types/globals.d.ts" />

import { type BuildConfig, fs, path } from "@brandingbrand/code-cli-kit";

import transformer from "../src/transformers/android/gemfile";

describe("gemfile transformers", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should not update gemfile with dependencies", async () => {
    const config = {
      ...__flagship_code_build_config,
    } as BuildConfig;

    const originalContent = await fs.readFile(path.android.gemfile, "utf-8");

    await transformer.transform(config, {} as any);
    const content = await fs.readFile(path.android.gemfile, "utf-8");

    expect(content).toEqual(originalContent);
  });

  it("should update gemfile with dependencies", async () => {
    const config = {
      ...__flagship_code_build_config,
    } as BuildConfig;

    config.android.gemfile = ["gem 'rails', '3.0.7'", "gem 'sqlite3'"];

    await transformer.transform(config, {} as any);
    const content = await fs.readFile(path.android.gemfile, "utf-8");

    expect(content).toContain("gem 'rails', '3.0.7'");
    expect(content).toContain("gem 'sqlite3'");
  });
});
