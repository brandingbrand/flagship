import path from "path";
import { fs, path as pathk } from "@brandingbrand/code-core";

import { ios, android } from "../src";

global.process.cwd = () => path.resolve(__dirname, "..");

jest.mock("@brandingbrand/code-core", () => {
  const core = jest.requireActual("@brandingbrand/code-core");

  return {
    ...core,
    fs: {
      ...core.fs,
      move: jest.fn().mockResolvedValue(undefined),
    },
  };
});

const bootsplash = require(pathk.project.resolve(
  "node_modules",
  "react-native-bootsplash",
  "dist",
  "commonjs",
  "generate.js"
));

const spy = jest.spyOn(bootsplash, "generate").mockResolvedValue({});

describe("plugin-splash-screen", () => {
  beforeAll(async () => {
    await fs.copy(
      path.resolve(__dirname, "fixtures", "mock_project"),
      path.resolve(__dirname, "fixtures", "temp_mock_project")
    );
  });

  afterAll(async () => {
    await fs.remove(path.resolve(__dirname, "fixtures", "temp_mock_project"));
  });
  it("ios", async () => {
    await ios({
      ios: { name: "HelloWorld" },
      codePluginSplashScreen: {
        plugin: {
          ios: {
            type: "generated",
          },
        },
      },
    } as never);

    expect(spy).toHaveBeenCalledWith({
      ios: { projectPath: pathk.project.resolve("ios", "HelloWorld") },
      android: null,
      workingPath: pathk.project.path(),
      logoPath: pathk.project.resolve(
        pathk.config.assetsPath(),
        "splash-screen",
        "ios",
        "generated",
        "logo.png"
      ),
      assetsPath: null,
      backgroundColor: "#333132",
      logoWidth: 212,
    });
  });

  it("android", async () => {
    jest
      .spyOn(pathk.project, "path")
      .mockReturnValue(
        path.resolve(__dirname, "fixtures", "temp_mock_project")
      );

    jest
      .spyOn(pathk.android, "resourcesPath")
      .mockReturnValue(pathk.project.path());

    jest
      .spyOn(pathk.android, "mainActivityPath")
      .mockReturnValue(path.resolve(pathk.project.path(), "MainActivity.java"));

    await android({
      android: { packageName: "com.helloworld" },
      codePluginSplashScreen: {
        plugin: {
          android: {
            type: "generated",
          },
        },
      },
    } as never);

    expect(spy).toHaveBeenCalledWith({
      ios: null,
      android: { sourceDir: pathk.project.resolve("android", "app") },
      flavor: "main",
      workingPath: pathk.project.path(),
      logoPath: pathk.project.resolve(
        pathk.config.assetsPath(),
        "splash-screen",
        "android",
        "generated",
        "logo.png"
      ),
      assetsPath: null,
      backgroundColor: "#333132",
      logoWidth: 180,
    });

    expect(
      (
        await fs.stat(
          pathk.project.resolve(pathk.android.resourcesPath(), "layout")
        )
      ).isDirectory()
    ).toBeTruthy();

    expect(
      (
        await fs.readFile(
          path.resolve(pathk.project.path(), "MainActivity.java")
        )
      ).toString()
    ).toMatch("setContentView(R.layout.splash);");
  });
});
