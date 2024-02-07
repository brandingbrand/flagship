/**
 * @jest-environment-options {"requireTemplate": true, "fixtures": "app-entitlements_fixtures"}
 */

/// <reference types="@brandingbrand/code-jest-config" />

import { type BuildConfig, fs, path } from "@brandingbrand/code-cli-kit";

import transformer from "../src/transformers/ios/app-entitlements";

describe("ios project.pbxproj transformers", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should not update app.entitlements file", async () => {
    const config = {
      ...__flagship_code_build_config,
    } as BuildConfig;

    const origionalContent = await fs.readFile(path.ios.entitlements, "utf-8");
    await transformer.transform(config, {} as any);
    const content = await fs.readFile(path.ios.entitlements, "utf-8");

    expect(content).toEqual(origionalContent);
  });

  it("should update app.entitlements file", async () => {
    const config = {
      ...__flagship_code_build_config,
    } as BuildConfig;

    config.ios.entitlementsFilePath = "./app.entitlements";

    const entitlementsFileContent = await fs.readFile(
      path.project.resolve("app.entitlements"),
      "utf-8"
    );

    await transformer.transform(config, {} as any);
    const content = await fs.readFile(path.ios.entitlements, "utf-8");

    expect(content).toEqual(entitlementsFileContent);
  });
});
