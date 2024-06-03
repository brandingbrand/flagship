/**
 * @jest-environment-options {"requireTemplate": true, "fixtures": "fixtures"}
 */

/// <reference types="@brandingbrand/code-jest-config" />


import { fs, path } from "@brandingbrand/code-cli-kit";

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

    await plugin.android?.({
      android: {
        gradle: {
          projectGradle: {
            kotlinVersion: "1.8.10"
          }
        }
      }
    } as any, {} as any);

    const buildGradle = await fs.readFile(path.android.buildGradle, "utf-8");

    const postLinkAndroid = require(rnnLinkAndroid);

    expect(buildGradle).toContain("classpath 'org.jetbrains.kotlin:kotlin-gradle-plugin:1.8.10'")
    expect(postLinkAndroid).toHaveBeenCalled();
  });
});
