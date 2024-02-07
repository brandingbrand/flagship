import type {
  BuildConfig,
  CodeConfig,
  PrebuildOptions,
} from "@brandingbrand/code-cli-kit";

import { config } from "../src/lib/config";

describe("config object", () => {
  it("should have default values for codeConfig, optionsConfig, and buildConfig", () => {
    expect(config.code).toEqual({});
    expect(config.options).toEqual({});
    expect(config.build).toEqual({});
  });

  it("should be able to update code configuration", () => {
    const codeConfig: CodeConfig = {
      buildPath: "./my/build/path",
      envPath: "./my/env/path",
      pluginPath: "./my/plugin/path",
      plugins: ["@brandingbrand/code-my-plugin"],
    };

    config.code = codeConfig;

    expect(config.code).toEqual(codeConfig);
  });

  it("should be able to update options configuration", () => {
    const optionsConfig: PrebuildOptions = {
      build: "internal",
      env: "prod",
      release: false,
      verbose: false,
      platform: "ios",
    };

    config.options = optionsConfig;

    expect(config.options).toEqual(optionsConfig);
  });

  it("should be able to update build configuration", () => {
    const buildConfig: BuildConfig = {
      ios: {
        bundleId: "com.brandingbrand",
        displayName: "Branding Brand",
      },
      android: {
        displayName: "Branding Brand",
        packageName: "com.brandingbrand",
      },
    };

    config.build = buildConfig;

    expect(config.build).toEqual(buildConfig);
  });
});
