/// <reference types="@brandingbrand/code-cli-kit/types"/>

/**
 * Defines a plugin for @brandingbrand/code-cli-kit.
 * @module Plugin
 */

import {
  definePlugin,
  fs,
  path,
  string,
  withPbxproj,
  withUTF8,
} from "@brandingbrand/code-cli-kit";

import type { CodePluginFirebaseApp } from "./types";

/**
 * Defines a plugin with functions for both iOS and Android platforms.
 * @alias module:Plugin
 * @param {BuildConfig} build - The build configuration object.
 * @param {PrebuildOptions} options - The options object.
 */
export default definePlugin<CodePluginFirebaseApp>({
  /**
   * Function to be executed for iOS platform.
   * @param {BuildConfig} build - The build configuration object for iOS.
   * @param {PrebuildOptions} options - The options object for iOS.
   * @returns {Promise<void>} A promise that resolves when the process completes.
   */
  ios: async function (build, options): Promise<void> {
    if (!build.codePluginFirebaseApp.plugin.ios) return;

    const { googleServicesPath } = build.codePluginFirebaseApp.plugin.ios;

    await fs.copyFile(
      path.project.resolve(googleServicesPath),
      path.project.resolve("ios", "app", "GoogleService-Info.plist")
    );

    await withPbxproj((project) => {
      const targetKey = project.findTargetKey("app");

      if (!targetKey) {
        throw Error("[CodePluginFirebaseApp]: cannot find target 'app' uuid");
      }

      const groupKey = project.findPBXGroupKey({ name: "app" });

      if (!groupKey) {
        throw Error("[CodePluginFirebaseApp]: cannot find group 'app' uuid");
      }

      if (!project.findPBXGroupKey({ name: "Resources" })) {
        const { uuid } = project.addPbxGroup([], "Resources", '""');

        project.addToPbxGroup(
          uuid,
          project.getFirstProject().firstProject.mainGroup
        );
      }

      project.addResourceFile(
        "app/GoogleService-Info.plist",
        { target: targetKey },
        ""
      );
    });

    await withUTF8(
      path.project.resolve("ios", "app", "AppDelegate.mm"),
      (content) => {
        content = string.replace(
          content,
          /(#import "AppDelegate.h")/,
          `$1

#import <Firebase.h>
`
        );

        return string.replace(
          content,
          /(didFinishLaunchingWithOptions[\s\S]+?{)/,
          `$1
  [FIRApp configure];`
        );
      }
    );

    await withUTF8(path.ios.podfile, (content) => {
      content = string.replace(
        content,
        /(config = use_native_modules!)/,
        `$1
use_frameworks! :linkage => :static
$RNFirebaseAsStaticFramework = true
`
      );

      return string.replace(
        content,
        /(:flipper_configuration[\s\S]+?\n)/,
        `# $1`
      );
    });
  },

  /**
   * Function to be executed for Android platform.
   * @param {BuildConfig & CodePluginAsset} build - The build configuration object for Android.
   * @param {PrebuildOptions} options - The options object for Android.
   * @returns {Promise<void>} A promise that resolves when the process completes.
   */
  android: async function (build, options): Promise<void> {
    if (!build.codePluginFirebaseApp.plugin.android) return;

    const { googleServicesPath, googleServicesVersion, firebaseBomVersion } =
      build.codePluginFirebaseApp.plugin.android;

    await fs.copyFile(
      path.project.resolve(googleServicesPath),
      path.project.resolve("android", "app", "google-services.json")
    );

    await withUTF8(path.android.buildGradle, (content) => {
      return string.replace(
        content,
        /(dependencies {)/,
        `$1
        classpath 'com.google.gms:google-services:${googleServicesVersion}'`
      );
    });

    await fs.appendFile(
      path.android.appBuildGradle,
      "apply plugin: 'com.google.gms.google-services'"
    );

    await withUTF8(path.android.appBuildGradle, (content) => {
      return string.replace(
        content,
        /(dependencies {)/,
        `$1
    implementation platform('com.google.firebase:firebase-bom:${firebaseBomVersion}')`
      );
    });
  },
});

export type { CodePluginFirebaseApp };
