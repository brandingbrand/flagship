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
    // Check if the plugin interface for iOS is defined
    if (!build.codePluginFastlane.plugin.ios) {
      throw Error(
        "[CodePluginFastlaneError]: attempted to run ios but interface is incorrect, please check your build configuration."
      );
    }

    // Check if the signing interface for iOS is defined
    if (!build.ios.signing) {
      throw Error(
        "[CodePluginFastlaneError]: attempted to run ios but signing interface is incorrect, please check your build configuration."
      );
    }

    // Get the path to the template directory
    const templatePath = path.join(
      require.resolve("@brandingbrand/code-plugin-fastlane/package.json"),
      "..",
      "template"
    );

    // Copy iOS template files to the project directory
    await fse.copy(
      path.resolve(templatePath, "ios"),
      path.project.resolve("ios")
    );

    // Update Gemfile for iOS with fastlane plugin
    await withUTF8(path.ios.gemfile, (content: string) => {
      return string.replace(
        content,
        /(source.*\n)/m,
        `$1gem 'fastlane'

plugins_path = File.join(File.dirname(__FILE__), 'fastlane', 'Pluginfile')
eval_gemfile(plugins_path) if File.exist?(plugins_path)`
      );
    });

    // Render Fastfile template for iOS
    await withUTF8(
      path.project.resolve("ios", "fastlane", "Fastfile"),
      (content) => {
        return ejs.render(content, { ...build, ...options });
      }
    );

    // Get list of provisioning profiles files
    const files = await fs.readdir(
      path.project.resolve(build.ios.signing.profilesDir)
    );

    // Update Fastfile with provisioning profiles
    await withUTF8(
      path.project.resolve("ios", "fastlane", "Fastfile"),
      (content) => {
        // Filter out non-provisioning profiles
        const profilesFiles = files.filter((it) =>
          it.match(/(\w+\.mobileprovision)/)
        );

        // Throw error if there are no available provisioning profiles
        if (!profilesFiles.length) {
          throw Error(
            `[CodePluginFastlane]: cannot find profiles that match *.mobileprovision in ${build.ios.signing!.profilesDir}`
          );
        }

        // Reduce list into a string that would be reprentative of a ruby array
        const profiles = profilesFiles
          .map(
            (it) =>
              `'${path.project.resolve(build.ios.signing!.profilesDir, it)}'`
          )
          .join(",");

        // Replace empty profiles array with reduced profiles string in ruby file
        content = string.replace(
          content,
          /(@profiles\s+=\s+\[).*(\])/,
          `$1${profiles}$2`
        );

        // Replace the distribution p12 with the absolute path of the distribution p12
        content = string.replace(
          content,
          /(certificate_path:\s+').*\.p12(')/,
          `$1${path.project.resolve(build.ios.signing!.distP12)}$2`
        );

        // Replace the distribution certificate with the absolute path of the distribution certificate.
        // Important to note that this is not a global replace due to greedy regex it will replace first
        // cert - the second cert is the AppleWWDRCA cert.
        content = string.replace(
          content,
          /(certificate_path:\s+').*\.cer(')/,
          `$1${path.project.resolve(build.ios.signing!.distCert)}$2`
        );

        // Replace the AppleWWDRCA certificate with the absolute path of the AppleWWDRCA certificate
        content = string.replace(
          content,
          /(certificate_path:\s+')AppleWWDRCA\.cer(')/,
          `$1${path.project.resolve(build.ios.signing!.appleCert)}$2`
        );

        return content;
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
    // Check if the plugin interface for Android is defined
    if (!build.codePluginFastlane.plugin.android) {
      throw Error(
        "[CodePluginFastlaneError]: attempted to run android but interface is incorrect, please check your build configuration."
      );
    }

    // Get the path to the template directory
    const templatePath = path.join(
      require.resolve("@brandingbrand/code-plugin-fastlane/package.json"),
      "..",
      "template"
    );

    // Copy Android template files to the project directory
    await fse.copy(
      path.resolve(templatePath, "android"),
      path.project.resolve("android")
    );

    // Update Gemfile for Android with fastlane plugin
    await withUTF8(path.android.gemfile, (content: string) => {
      return string.replace(
        content,
        /(source.*\n)/m,
        `$1gem 'fastlane'

plugins_path = File.join(File.dirname(__FILE__), 'fastlane', 'Pluginfile')
eval_gemfile(plugins_path) if File.exist?(plugins_path)`
      );
    });

    // Render Fastfile template for Android
    await withUTF8(
      path.project.resolve("android", "fastlane", "Fastfile"),
      (content) => {
        return ejs.render(content, { ...build, ...options });
      }
    );
  },
});

export type { CodePluginFastlane };
