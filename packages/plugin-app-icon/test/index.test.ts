import path from "path";
import { fs, path as pathk } from "@brandingbrand/kernel-core";

import { ios, android } from "../src";

jest.mock("../src/utils/rules", () => ({
  android: [
    {
      platform: "android",
      size: { legacy: 192, adaptive: 432 },
      dpi: "xxxhdpi",
    },
  ],
  ios: [
    {
      platform: "ios",
      size: { universal: 1024 },
      scale: 1,
      idiom: "ios-marketing",
    },
  ],
}));

global.process.cwd = () => path.resolve(__dirname, "fixtures", "mock_project");

describe("plugin-app-icon", () => {
  beforeAll(async () => {
    await fs.mkdir(
      path.resolve(__dirname, "fixtures", "mock_project", "mipmap-xxxhdpi")
    );

    await fs.mkdir(
      path.resolve(__dirname, "fixtures", "mock_project", "AppIcon.appiconset")
    );
  });
  afterAll(async () => {
    await fs.remove(
      path.resolve(__dirname, "fixtures", "mock_project", "mipmap-xxxhdpi")
    );
    await fs.remove(
      path.resolve(__dirname, "fixtures", "mock_project", "mipmap-anydpi-v26")
    );
    await fs.remove(
      path.resolve(__dirname, "fixtures", "mock_project", "AppIcon.appiconset")
    );
  });

  it("ios", async () => {
    jest.mock("@brandingbrand/kernel-core", () => {
      const core = jest.requireActual("@brandingbrand/kernel-core");

      return {
        ...core,
        fs: {
          ...core.fs,
          writeFile: jest.fn().mockResolvedValue(undefined),
        },
      };
    });
    jest
      .spyOn(pathk.ios, "appIconSetPath")
      .mockReturnValue(pathk.project.resolve("AppIcon.appiconset"));

    await ios({ ios: { name: "HelloWorld" } } as never);

    expect(
      await fs.pathExists(
        pathk.project.resolve(
          "AppIcon.appiconset",
          "Icon-1024-ios-marketing.png"
        )
      )
    ).toBeTruthy();
  });

  it("android", async () => {
    jest.mock("@brandingbrand/kernel-core", () => {
      const core = jest.requireActual("@brandingbrand/kernel-core");

      return {
        ...core,
        fs: {
          ...core.fs,
          mkdir: jest.fn().mockResolvedValue(undefined),
          writeFile: jest.fn().mockResolvedValue(undefined),
        },
      };
    });
    jest
      .spyOn(pathk.android, "resourcesPath")
      .mockReturnValue(pathk.project.path());

    await android();

    expect(
      await fs.pathExists(
        pathk.project.resolve("mipmap-xxxhdpi", "ic_launcher_background.png")
      )
    ).toBeTruthy();
  });
});
