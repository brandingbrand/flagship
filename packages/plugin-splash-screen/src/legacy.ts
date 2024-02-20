/// <reference types="@brandingbrand/code-cli-kit/types"/>

import fse from "fs-extra";
import {
  BuildConfig,
  path,
  withPbxproj,
  withUTF8,
  string,
} from "@brandingbrand/code-cli-kit";

import type { CodePluginSplashScreen } from "./types";

/**
 * Generates iOS splash screen using provided configuration.
 * @param config The build configuration including splash screen settings.
 */
export async function ios(config: BuildConfig & CodePluginSplashScreen) {
  // Extract xcassetsDir and xcassetsFile from the iOS legacy splash screen configuration
  const { xcassetsDir, xcassetsFile } =
    // @ts-ignore
    config.codePluginSplashScreen.plugin.ios.legacy;

  // Copy xcassetsDir to iOS app directory
  await fse.copy(
    path.project.resolve(xcassetsDir),
    path.project.resolve("ios", "app"),
    {
      overwrite: true,
    }
  );

  // Modify the iOS project file to include the splash screen resource
  withPbxproj((project) => {
    const targetKey = project.findTargetKey("app");

    if (!targetKey) {
      throw Error(
        "[CodePluginSplashCreenError]: cannot find target 'app' uuid"
      );
    }

    const groupKey = project.findPBXGroupKey({ name: "app" });

    if (!groupKey) {
      throw Error("[CodePluginSplashCreenError]: cannot find group 'app' uuid");
    }

    project.addPbxGroup([], "Resources", '""');

    project.addResourceFile(
      `app/${xcassetsFile}`,
      { target: targetKey },
      groupKey
    );
  });
}

/**
 * Generates Android splash screen using provided configuration.
 * @param config The build configuration including splash screen settings.
 */
export async function android(config: BuildConfig & CodePluginSplashScreen) {
  // Extract assetsDir from the Android legacy splash screen configuration
  // @ts-ignore
  const { assetsDir } = config.codePluginSplashScreen.plugin.android.legacy;

  // Copy assetsDir to Android res directory
  await fse.copy(
    path.project.resolve(assetsDir),
    path.project.resolve("android", "app", "src", "main", "res"),
    {
      overwrite: true,
    }
  );

  // Update the main activity file to set the splash screen layout
  await withUTF8(path.android.mainActivity(config), (content) => {
    // Add package imports to the main activity
    content = string.replace(
      content,
      /(package[\s\S]+?;)/,
      `$1
    
import android.os.Bundle;
import androidx.annotation.Nullable;
    `
    );

    // Add onCreate method to the main activity to set the splash screen layout
    content = string.replace(
      content,
      /(public class[\s\S]+?{)/,
      `$1
  @Override
  protected void onCreate(@Nullable Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.splash);
  }
`
    );

    return content;
  });
}
