import path from "path";
import { fs, path as pathk } from "@brandingbrand/code-core";

import { ios, android } from "../src";

global.process.cwd = () => path.resolve(__dirname, "..");

jest.mock("glob", () => ({
  sync: () => [""],
}));

jest.spyOn(fs, "chmod").mockResolvedValue(undefined);

jest.mock("../src/utils/dependencies");

describe("plugin-native-navigation", () => {
  it("ios", async () => {
    jest.mock(
      pathk.project.resolve(
        "node_modules",
        "react-native-navigation",
        "autolink",
        "postlink",
        "postLinkIOS.js"
      ),
      () => jest.fn().mockResolvedValue(undefined)
    );

    await ios();

    const postLinkIOS = require(pathk.project.resolve(
      "node_modules",
      "react-native-navigation",
      "autolink",
      "postlink",
      "postLinkIOS.js"
    ));

    expect(postLinkIOS).toBeCalled();
  });

  it("android", async () => {
    jest.mock(
      pathk.project.resolve(
        "node_modules",
        "react-native-navigation",
        "autolink",
        "postlink",
        "postLinkAndroid.js"
      ),
      () => jest.fn().mockResolvedValue(undefined)
    );

    await android();

    const postLinkAndroid = require(pathk.project.resolve(
      "node_modules",
      "react-native-navigation",
      "autolink",
      "postlink",
      "postLinkAndroid.js"
    ));

    expect(postLinkAndroid).toBeCalled();
  });
});
