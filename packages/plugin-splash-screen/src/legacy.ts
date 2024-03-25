/// <reference types="@brandingbrand/code-cli-kit/types"/>

import fse from "fs-extra";
import {
  BuildConfig,
  path,
  withPbxproj,
  withUTF8,
  string,
  withInfoPlist,
} from "@brandingbrand/code-cli-kit";

import type { CodePluginSplashScreen } from "./types";

/**
 * Generates iOS splash screen using provided configuration.
 * @param config The build configuration including splash screen settings.
 */
export async function ios(config: BuildConfig & CodePluginSplashScreen) {
  if (config.codePluginSplashScreen.plugin.ios?.type !== "legacy") {
    throw Error(
      "[CodePluginSplashScreen]: generated was inadvertently executed with the incorrect config - 'type' must be 'legacy'"
    );
  }

  // Extract xcassetsDir and xcassetsFile from the iOS legacy splash screen configuration
  const { xcassetsDir, xcassetsFile, storyboardFile } =
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
    /**
     * Aggregate the target key in the format of the uuid.
     */
    const targetKey = project.findTargetKey("app");

    /**
     * The target key in the format of a uuid is required to proceed further
     * in order to add assets to the correct target - throw error otherwise.
     */
    if (!targetKey) {
      throw Error(
        "[CodePluginSplashCreenError]: cannot find target 'app' uuid"
      );
    }

    /**
     * Aggregate the group key in the format of the uuid.
     */
    const groupKey = project.findPBXGroupKey({ name: "app" });

    /**
     * The group key in the format of a uuid is required to proceed further
     * in order to add assets to the correct group - throw error otherwise.
     */
    if (!groupKey) {
      throw Error("[CodePluginSplashCreenError]: cannot find group 'app' uuid");
    }

    /**
     * There is no resource group by defaul so add in case another plugin has not
     * already created it. This would otherwise error out with vague message.
     */
    project.addPbxGroup([], "Resources", '""');

    /**
     * Add the xcassets so they can be utilized by the launch screen.
     */
    project.addResourceFile(
      `app/${xcassetsFile}`,
      { target: targetKey },
      groupKey
    );

    /**
     * Short circuit return in case the storyboard file name doesn't change
     * from the default value - no need to re-add it as a resource with
     * an added side-effect.
     */
    if (storyboardFile === "LaunchScreen.storyboard") return;

    /**
     * Add newly named storyboard resource file.
     */
    project.addResourceFile(
      `app/${storyboardFile}`,
      { target: targetKey },
      groupKey
    );
  });

  /**
   * Short circuit return in case the file storyboard file name doesn't change
   * from the default value - no need to update the Info.plist with an
   * added side-effect.
   */
  if (storyboardFile === "LaunchScreen.storyboard") return;

  /**
   * Update Info.plist with newly named storyboard.
   */
  await withInfoPlist((plist) => {
    return {
      ...plist,
      UILaunchStoryboardName: storyboardFile,
    };
  });
}

/**
 * Generates Android splash screen using provided configuration.
 * @param config The build configuration including splash screen settings.
 */
export async function android(config: BuildConfig & CodePluginSplashScreen) {
  if (config.codePluginSplashScreen.plugin.android?.type !== "legacy") {
    throw Error(
      "[CodePluginSplashScreen]: generated was inadvertently executed with the incorrect config - 'type' must be 'legacy'"
    );
  }

  // Extract assetsDir from the Android legacy splash screen configuration
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
