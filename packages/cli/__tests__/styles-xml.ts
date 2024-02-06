/**
 * @jest-environment-options {"requireTemplate": true}
 */

/// <reference types="@brandingbrand/code-jest-config" />

import { type BuildConfig, fs, path } from "@brandingbrand/code-cli-kit";

import transformer from "../src/transformers/android/styles-xml";

describe("android styles.xml transformers", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should update styles.xml with dark theme", async () => {
    const config = {
      ...__flagship_code_build_config,
    } as BuildConfig;

    config.android.style = "dark";

    await transformer.transform(config, {} as any);
    const content = await fs.readFile(path.android.styles, "utf-8");

    expect(content).toContain(`<resources>
    <style name="AppTheme" parent="Theme.AppCompat.NoActionBar">
        <item name="android:editTextBackground">@drawable/rn_edit_text_material</item>
    </style>
</resources>`);
  });

  it("should update styles.xml with light theme", async () => {
    const config = {
      ...__flagship_code_build_config,
    } as BuildConfig;

    config.android.style = "light";

    await transformer.transform(config, {} as any);
    const content = await fs.readFile(path.android.styles, "utf-8");

    expect(content).toContain(`<resources>
    <style name="AppTheme" parent="Theme.AppCompat.Light.NoActionBar">
        <item name="android:editTextBackground">@drawable/rn_edit_text_material</item>
    </style>
</resources>`);
  });

  it("should update styles.xml with system theme", async () => {
    const config = {
      ...__flagship_code_build_config,
    } as BuildConfig;

    config.android.style = "system";

    await transformer.transform(config, {} as any);
    const content = await fs.readFile(path.android.styles, "utf-8");

    expect(content).toContain(`<resources>
    <style name="AppTheme" parent="Theme.AppCompat.DayNight.NoActionBar">
        <item name="android:editTextBackground">@drawable/rn_edit_text_material</item>
    </style>
</resources>`);
  });
});
