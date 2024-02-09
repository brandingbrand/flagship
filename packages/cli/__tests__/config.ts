import type {
  BuildConfig,
  CodeConfig,
  PrebuildOptions,
} from "@brandingbrand/code-cli-kit";

import { bundleRequire, config, isPackage } from "../src/lib/config";

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
      command: "prebuild",
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

describe("isPackage", () => {
  it("should return true for a valid package name", () => {
    const packageName = "lodash";
    expect(isPackage(packageName)).toBe(true);
  });

  it("should return true for a valid scoped package name", () => {
    const scopedPackageName = "@types/lodash";
    expect(isPackage(scopedPackageName)).toBe(true);
  });

  it("should return false for a file path", () => {
    const filePath = "path/to/file";
    expect(isPackage(filePath)).toBe(false);
  });

  it("should return false for a Windows file path", () => {
    const windowsFilePath = "C:\\path\\to\\file";
    expect(isPackage(windowsFilePath)).toBe(false);
  });

  it("should return false for a file path with extension", () => {
    const filePathWithExtension = "file.js";
    expect(isPackage(filePathWithExtension)).toBe(true);
  });
});
