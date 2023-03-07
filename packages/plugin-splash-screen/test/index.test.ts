/**
 * @jest-environment-options {"fixture": "__plugin-splash-screen_fixtures"}
 */

import path from "path";
import { fs, path as pathk } from "@brandingbrand/code-core";

import { ios, android } from "../src";

describe("plugin-splash-screen", () => {
  jest
    .spyOn(pathk.project, "resolve")
    .mockImplementation((...args: string[]) =>
      path.resolve.apply(path, [path.resolve(__dirname, ".."), ...args])
    );
  jest
    .spyOn(fs, "move")
    .mockImplementation((_source: string, _dest: string) => {
      //
    });
  const spy = jest
    .spyOn(
      require(pathk.project.resolve(
        "node_modules",
        "react-native-bootsplash",
        "dist",
        "commonjs",
        "generate.js"
      )),
      "generate"
    )
    .mockResolvedValue({});

  it("ios", async () => {
    await ios({
      ...global.__FLAGSHIP_CODE_CONFIG__,
      codePluginSplashScreen: {
        plugin: {
          ios: {
            type: "generated",
          },
        },
      },
    });

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
    await android({
      ...global.__FLAGSHIP_CODE_CONFIG__,
      codePluginSplashScreen: {
        plugin: {
          android: {
            type: "generated",
          },
        },
      },
    });

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

    const layout = (
      await fs.stat(
        pathk.project.resolve(pathk.android.resourcesPath(), "layout")
      )
    ).isDirectory();
    const mainActivity = (
      await fs.readFile(
        path.resolve(
          pathk.android.mainActivityPath(global.__FLAGSHIP_CODE_CONFIG__)
        )
      )
    ).toString();

    expect(layout).toBeTruthy();
    expect(mainActivity).toMatch("setContentView(R.layout.splash);");
  });
});
