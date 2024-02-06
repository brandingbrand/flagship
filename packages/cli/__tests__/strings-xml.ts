/**
 * @jest-environment-options {"requireTemplate": true}
 */

/// <reference types="@brandingbrand/code-jest-config" />

import { type BuildConfig, fs, path } from "@brandingbrand/code-cli-kit";

import transformer from "../src/transformers/android/strings-xml";

describe("android strings.xml transformers", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should update strings.xml with string", async () => {
    const config = {
      ...__flagship_code_build_config,
    } as BuildConfig;

    config.android.strings = {
      string: {
        myKey: "myValue",
      },
    };

    await transformer.transform(config, {} as any);
    const content = await fs.readFile(path.android.strings, "utf-8");

    expect(content).toContain(
      `<resources>
    <string name="app_name">app</string>
    <string name="myKey">myValue</string>
</resources>`
    );
  });

  it("should update strings.xml with stringArray", async () => {
    const config = {
      ...__flagship_code_build_config,
    } as BuildConfig;

    config.android.strings = {
      stringArray: {
        planets_array: ["Mercury", "Venus", "Earth", "Mars"],
      },
    };

    await transformer.transform(config, {} as any);
    const content = await fs.readFile(path.android.strings, "utf-8");

    expect(content).toContain(`<resources>
    <string name="app_name">app</string>
    <string name="myKey">myValue</string>
    <string-array name="planets_array">
        <item>Mercury</item>
        <item>Venus</item>
        <item>Earth</item>
        <item>Mars</item>
    </string-array>
</resources>`);
  });

  it("should update strings.xml with stringArray", async () => {
    const config = {
      ...__flagship_code_build_config,
    } as BuildConfig;

    config.android.strings = {
      plurals: {
        numberOfSongsAvailable: [
          {
            quantity: "one",
            value: "1 song found.",
          },
          {
            quantity: "other",
            value: "2 songs found.",
          },
        ],
      },
    };

    await transformer.transform(config, {} as any);
    const content = await fs.readFile(path.android.strings, "utf-8");

    expect(content).toContain(`<resources>
    <string name="app_name">app</string>
    <string name="myKey">myValue</string>
    <string-array name="planets_array">
        <item>Mercury</item>
        <item>Venus</item>
        <item>Earth</item>
        <item>Mars</item>
    </string-array>
    <plurals name="numberOfSongsAvailable">
        <item quantity="one">1 song found.</item>
        <item quantity="other">2 songs found.</item>
    </plurals>
</resources>`);
  });
});
