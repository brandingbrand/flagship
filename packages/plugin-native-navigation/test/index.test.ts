import path from "path";
import { path as pathk } from "@brandingbrand/kernel-core";

import { ios, android } from "../src";

global.process.cwd = () => path.resolve(__dirname, "..", "..", "..");

jest.mock("glob", () => ({
  sync: () => [""],
}));

jest.mock("@brandingbrand/kernel-core", () => {
  const core = jest.requireActual("@brandingbrand/kernel-core");

  return {
    ...core,
    fs: {
      ...core.fs,
      chmod: jest.fn().mockResolvedValue(undefined),
    },
  };
});

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
      )
    );

    const postLinkIOS = require(pathk.project.resolve(
      "node_modules",
      "react-native-navigation",
      "autolink",
      "postlink",
      "postLinkIOS.js"
    ));

    await ios();

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
      )
    );

    const postLinkAndroid = require(pathk.project.resolve(
      "node_modules",
      "react-native-navigation",
      "autolink",
      "postlink",
      "postLinkAndroid.js"
    ));

    await android();

    expect(postLinkAndroid).toBeCalled();
  });
});
