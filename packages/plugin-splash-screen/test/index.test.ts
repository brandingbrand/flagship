/**
 * @jest-environment-options {"fixture": "__plugin-splash-screen_fixtures"}
 */

import { fs, path } from "@brandingbrand/code-core";

import { ios, android } from "../src";

describe("plugin-splash-screen", () => {
  jest
    .spyOn(fs, "move")
    .mockImplementation((_source: string, _dest: string) => {
      //
    });
  const spy = jest
    .spyOn(
      require(path.hoist.resolve(
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
      ios: { projectPath: path.project.resolve("ios", "HelloWorld") },
      android: null,
      workingPath: path.project.path(),
      logoPath: path.project.resolve(
        path.config.assetsPath(),
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
      android: { sourceDir: path.project.resolve("android", "app") },
      flavor: "main",
      workingPath: path.project.path(),
      logoPath: path.project.resolve(
        path.config.assetsPath(),
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
        path.project.resolve(path.android.resourcesPath(), "layout")
      )
    ).isDirectory();
    const mainActivity = (
      await fs.readFile(
        path.resolve(
          path.android.mainActivityPath(global.__FLAGSHIP_CODE_CONFIG__)
        )
      )
    ).toString();

    expect(layout).toBeTruthy();
    expect(mainActivity).toMatch("setContentView(R.layout.splash);");
  });
});
