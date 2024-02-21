/**
 * Defines a plugin for @brandingbrand/code-cli-kit.
 * @module Plugin
 */
import ejs from "ejs";
import fse from "fs-extra";
import {
  type BuildConfig,
  type PrebuildOptions,
  definePlugin,
  fs,
  path,
  string,
  withUTF8,
} from "@brandingbrand/code-cli-kit";

import type { CodePluginFastlane } from "./types";

/**
 * Defines a plugin with functions for both iOS and Android platforms.
 * @alias module:Plugin
 * @param {BuildConfig & CodePluginFastlane} build - The build configuration object.
 * @param {PrebuildOptions} options - The options object.
 */
export default definePlugin<CodePluginFastlane>({
  /**
   * Function to be executed for iOS platform.
   * @param {BuildConfig & CodePluginTargetExtension} build - The build configuration object for iOS.
   * @param {PrebuildOptions} options - The options object for iOS.
   * @returns {Promise<void>} A promise that resolves when the process completes.
   */
  ios: async function (
    build: BuildConfig & CodePluginFastlane,
    options: PrebuildOptions
  ): Promise<void> {
    if (!build.codePluginFastlane.plugin.ios) {
      throw Error(
        "[CodePluginFastlaneError]: attempted to run ios but interface is incorrect, please check your build configuration."
      );
    }

    if (!build.ios.signing) {
      throw Error(
        "[CodePluginFastlaneError]: attempted to run ios but signing interface is incorrect, please check your build configuration."
      );
    }

    const templatePath = path.join(
      require.resolve("@brandingbrand/code-plugin-fastlane/package.json"),
      "..",
      "template"
    );

    await fse.copy(
      path.resolve(templatePath, "ios"),
      path.project.resolve("ios")
    );

    await withUTF8(path.ios.gemfile, (content: string) => {
      return string.replace(
        content,
        /(source.*\n)/m,
        `$1gem 'fastlane'

plugins_path = File.join(File.dirname(__FILE__), 'fastlane', 'Pluginfile')
eval_gemfile(plugins_path) if File.exist?(plugins_path)`
      );
    });

    await withUTF8(
      path.project.resolve("ios", "fastlane", "Fastfile"),
      (content) => {
        return ejs.render(content, { ...build, ...options });
      }
    );

    const files = await fs.readdir(
      path.project.resolve(build.ios.signing.profilesDir)
    );

    await withUTF8(
      path.project.resolve("ios", "fastlane", "Fastfile"),
      (content) => {
        const profilesFiles = files.filter((it) =>
          it.match(/(\w+\.mobileprovision)/)
        );

        if (!profilesFiles.length) {
          throw Error(
            `[CodePluginFastlane]: cannot find profiles that match *.mobileprovision in ${build.ios.signing!.profilesDir}`
          );
        }

        const profiles = profilesFiles
          .map(
            (it) =>
              `'${path.project.resolve(build.ios.signing!.profilesDir, it)}'`
          )
          .join(",");

        return string.replace(
          content,
          /(@profiles\s+=\s+\[).*(\])/,
          `$1${profiles}$2`
        );
      }
    );
  },

  /**
   * Function to be executed for Android platform.
   * @param {BuildConfig & CodePluginTargetExtension} build - The build configuration object for Android.
   * @param {PrebuildOptions} options - The options object for Android.
   * @returns {Promise<void>} A promise that resolves when the process completes.
   */
  android: async function (
    build: BuildConfig & CodePluginFastlane,
    options: PrebuildOptions
  ): Promise<void> {
    if (!build.codePluginFastlane.plugin.android) {
      throw Error(
        "[CodePluginFastlaneError]: attempted to run android but interface is incorrect, please check your build configuration."
      );
    }

    const templatePath = path.join(
      require.resolve("@brandingbrand/code-plugin-fastlane/package.json"),
      "..",
      "template"
    );

    await fse.copy(
      path.resolve(templatePath, "android"),
      path.project.resolve("android")
    );

    await withUTF8(path.android.gemfile, (content: string) => {
      return string.replace(
        content,
        /(source.*\n)/m,
        `$1gem 'fastlane'

plugins_path = File.join(File.dirname(__FILE__), 'fastlane', 'Pluginfile')
eval_gemfile(plugins_path) if File.exist?(plugins_path)`
      );
    });

    await withUTF8(
      path.project.resolve("android", "fastlane", "Fastfile"),
      (content) => {
        return ejs.render(content, { ...build, ...options });
      }
    );
  },
});

export type { CodePluginFastlane };
