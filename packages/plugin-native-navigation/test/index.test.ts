/**
 * @jest-environment-options {"fixture": "__plugin-native-navigation_fixtures", "additionalDirectory": "./fixtures"}
 */

import { path } from "@brandingbrand/code-core";

import { ios, android } from "../src";

describe("plugin-native-navigation", () => {
  const rnnlinkIOS = path.hoist.resolve(
    "react-native-navigation",
    "autolink",
    "postlink",
    "postLinkIOS.js"
  );

  const rnnlinkAndroid = path.hoist.resolve(
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
