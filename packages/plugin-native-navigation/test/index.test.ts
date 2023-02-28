import path from "path";
import { path as pathk } from "@brandingbrand/code-core";

import { ios, android } from "../src";

global.process.cwd = () => path.resolve(__dirname, "..");

jest.mock("../src/utils/dependencies");

describe("plugin-native-navigation", () => {
  const rnnlinkIOS = pathk.project.resolve(
    "node_modules",
    "react-native-navigation",
    "autolink",
    "postlink",
    "postLinkIOS.js"
  );
  const rnnlinkAndroid = pathk.project.resolve(
    "node_modules",
    "react-native-navigation",
    "autolink",
    "postlink",
    "postLinkAndroid.js"
  );

  it("ios", async () => {
    jest.mock(rnnlinkIOS, () => jest.fn().mockResolvedValue(undefined));

    await ios();

    const postLinkIOS = require(rnnlinkIOS);

    expect(postLinkIOS).toBeCalled();
  });

  it("android", async () => {
    jest.mock(rnnlinkAndroid, () => jest.fn().mockResolvedValue(undefined));

    await android();

    const postLinkAndroid = require(rnnlinkAndroid);

    expect(postLinkAndroid).toBeCalled();
  });
});
