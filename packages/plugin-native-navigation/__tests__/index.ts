import plugin from "../src";

describe("plugin-native-navigation", () => {
  const rnnLinkIOS = require.resolve(
    "react-native-navigation/autolink/postlink/postLinkIOS.js",
    { paths: [process.cwd()] }
  );

  const rnnLinkAndroid = require.resolve(
    "react-native-navigation/autolink/postlink/postLinkAndroid.js",
    { paths: [process.cwd()] }
  );

  it("ios", async () => {
    jest.mock(rnnLinkIOS, () => jest.fn().mockResolvedValue(undefined));

    await plugin.ios?.({} as any, {} as any);

    const postLinkIOS = require(rnnLinkIOS);

    expect(postLinkIOS).toHaveBeenCalled();
  });

  it("android", async () => {
    jest.mock(rnnLinkAndroid, () => jest.fn().mockResolvedValue(undefined));

    await plugin.android?.({} as any, {} as any);

    const postLinkAndroid = require(rnnLinkAndroid);

    expect(postLinkAndroid).toHaveBeenCalled();
  });
});
