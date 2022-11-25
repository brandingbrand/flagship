import path from "path";
import { path as pathk } from "@brandingbrand/kernel-core";

import { ios, android } from "../src";

global.process.cwd = () => path.resolve(__dirname, "..", "..", "..");
jest.mock("../../../node_modules/react-native-asset/lib");

describe("plugin-asset", () => {
  it("ios", async () => {
    const linkAssets = require("../../../node_modules/react-native-asset/lib");
    ios();

    expect(linkAssets).toBeCalledWith({
      rootPath: pathk.project.path(),
      shouldUnlink: true,
      platforms: {
        ios: {
          enabled: true,
          assets: [pathk.config.resolve("./assets/fonts")],
        },
        android: {
          enabled: false,
          assets: [],
        },
      },
    });
  });

  it("android", () => {
    const linkAssets = require("../../../node_modules/react-native-asset/lib");
    android();

    expect(linkAssets).toBeCalledWith({
      rootPath: pathk.project.path(),
      shouldUnlink: true,
      platforms: {
        android: {
          enabled: true,
          assets: [pathk.config.resolve("./assets/fonts")],
        },
        ios: {
          enabled: false,
          assets: [],
        },
      },
    });
  });
});
