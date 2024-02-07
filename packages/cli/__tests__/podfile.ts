/**
 * @jest-environment-options {"requireTemplate": true}
 */

/// <reference types="@brandingbrand/code-jest-config" />

import { type BuildConfig, fs, path } from "@brandingbrand/code-cli-kit";

import transformer from "../src/transformers/ios/podfile";

describe("ios gemfile transformers", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should update podfile with dependencies", async () => {
    const config = {
      ...__flagship_code_build_config,
    } as BuildConfig;

    config.ios.podfile = {
      pods: ["pod 'PubNub', '~> 4.0'", "pod 'FlagshipCode', '~> 13.0'"],
      config: ["inhibit_all_warnings!"],
    };

    await transformer.transform(config, {} as any);
    const content = await fs.readFile(path.ios.podfile, "utf-8");

    expect(content).toContain("pod 'PubNub', '~> 4.0'");
    expect(content).toContain("pod 'FlagshipCode', '~> 13.0'");
  });

  it("should update podfile with config", async () => {
    const config = {
      ...__flagship_code_build_config,
    } as BuildConfig;

    config.ios.podfile = {
      config: ["inhibit_all_warnings!"],
    };

    await transformer.transform(config, {} as any);
    const content = await fs.readFile(path.ios.podfile, "utf-8");

    expect(content).toContain("inhibit_all_warnings!");
  });

  it("should update podfile with minimum platform version", async () => {
    const config = {
      ...__flagship_code_build_config,
    } as BuildConfig;

    config.ios.deploymentTarget = "15.0";

    await transformer.transform(config, {} as any);
    const content = await fs.readFile(path.ios.podfile, "utf-8");

    expect(content).toContain("platform :ios, '15.0'");
  });
});
