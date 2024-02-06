/**
 * @jest-environment-options {"requireTemplate": true}
 */

/// <reference types="@brandingbrand/code-jest-config" />

import { type BuildConfig, fs, path } from "@brandingbrand/code-cli-kit";

import transformer from "../src/transformers/android/colors-xml";

describe("android colors.xml transformers", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should update colors.xml with opaque_red #f00", async () => {
    const config = {
      ...__flagship_code_build_config,
    } as BuildConfig;

    config.android.colors = {
      opaque_red: "#f00",
    };

    await transformer.transform(config, {} as any);
    const content = await fs.readFile(path.android.colors, "utf-8");

    expect(content).toContain(`<resources>
    <color name="opaque_red">#f00</color>
</resources>`);
  });
});
