/**
 * @jest-environment-options {"requireTemplate": true}
 */

/// <reference types="@brandingbrand/code-jest-config" />

import { type BuildConfig, fs, path } from "@brandingbrand/code-cli-kit";

import transformer from "../src/transformers/android/android-manifest-xml";

describe("android AndroidManifest.xml transformers", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should update AndroidManifest.xml with url scheme", async () => {
    const config = {
      ...__flagship_code_build_config,
    } as BuildConfig;

    config.android.manifest = {
      urlScheme: {
        scheme: "myapp",
      },
    };

    await transformer.transform(config, {} as any);
    const content = await fs.readFile(path.android.androidManifest, "utf-8");

    expect(content).toContain(`<intent-filter>
                <action android:name="android.intent.action.VIEW"/>
                <category android:name="android.intent.category.DEFAULT"/>
                <category android:name="android.intent.category.BROWSABLE"/>
                <data android:scheme="myapp"/>
            </intent-filter>`);
  });

  it("should update AndroidManifest.xml with url scheme", async () => {
    const config = {
      ...__flagship_code_build_config,
    } as BuildConfig;

    config.android.manifest = {
      urlScheme: {
        scheme: "myapp",
        host: "app",
      },
    };

    await transformer.transform(config, {} as any);
    const content = await fs.readFile(path.android.androidManifest, "utf-8");

    expect(content).toContain(`<intent-filter>
                <action android:name="android.intent.action.VIEW"/>
                <category android:name="android.intent.category.DEFAULT"/>
                <category android:name="android.intent.category.BROWSABLE"/>
                <data android:scheme="myapp" android:host="app"/>
            </intent-filter>`);
  });
});
