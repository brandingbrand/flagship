/// <reference types="@brandingbrand/code-cli-kit/types"/>

import {
  type BuildConfig,
  type PrebuildOptions,
  path,
  withPbxproj,
} from "@brandingbrand/code-cli-kit";
import type { XcodeProject, PBXFile } from "xcode";

import { Transforms, defineTransformer } from "@/lib";

/**
 * Defines a transformer for the iOS project's "project.pbxproj" file.
 *
 * @type {typeof defineTransformer<(content: XcodeProject, config: BuildConfig) => void>} - The type of the transformer.
 * @property {string} file - The name of the file to be transformed ("project.pbxproj").
 * @property {Array<(content: string, XcodeProject: BuildConfig) => void>} transforms - An array of transformer functions.
 * @property {Function} transform - The main transform function that applies all specified transformations.
 * @returns {Promise<void>} The updated content of the "project.pbxproj" file.
 */
export default defineTransformer<Transforms<XcodeProject, void>>({
  /**
   * The name of the file to be transformed ("project.pbxproj").
   * @type {string}
   */
  file: "project.pbxproj",

  /**
   * An array of transformer functions to be applied to the "project.pbxproj" file.
   * Each function receives the content of the file and the build configuration,
   * and returns the updated content after applying specific transformations.
   * @type {Array<(content: XcodeProject, config: BuildConfig) => void>}
   */
  transforms: [
    /**
     * Transformer for adding source and header files that exist in project in
     * "project.pbxproj".
     * @param {XcodeProject} project - The content of the file.
     * @returns {void} - The updated content.
     */
    (project: XcodeProject): void => {
      const targetKey = project.findTargetKey("app");

      if (!targetKey) {
        throw Error(`[PbxprojTransformerError]: cannot find target "app" uuid`);
      }

      const opt = { target: targetKey };

      const groupKey = project.findPBXGroupKey({ name: "app" });

      if (!groupKey) {
        throw Error(`[PbxprojTransformerError]: cannot find group "app" uuid`);
      }

      // These files exist as extras and need to be added to pbxproj file as
      // source files or header files
      project.addSourceFile("app/app.swift", opt, groupKey);
      project.addSourceFile("app/EnvSwitcher.m", opt, groupKey);
      project.addSourceFile("app/NativeConstants.m", opt, groupKey);
      project.addHeaderFile("app/app-Bridging-Header.h", opt, groupKey);

      // *.entitlements file can be treated same as a header file with
      // respect to "xcode" module, force lastKnownFileType and defaultEncoding
      // as this is not a detectble filetype by PBXFile.
      // https://github.com/apache/cordova-node-xcode/blob/e594cd453e8f26d8916e4be7bdfb309b8e820e2f/lib/pbxFile.js#L27
      project.addHeaderFile(
        "app/app.entitlements",
        {
          ...opt,
          lastKnownFileType: "text.plist.entitlements",
          defaultEncoding: 4,
        },
        groupKey
      ) as PBXFile;

      // Required build setting when utilizing bridging header
      project.addToBuildSettings(
        "SWIFT_OBJC_BRIDGING_HEADER",
        "app/app-Bridging-Header.h"
      );

      // Required build setting when adding entitlements
      project.addToBuildSettings(
        "CODE_SIGN_ENTITLEMENTS",
        "app/app.entitlements"
      );
    },

    /**
     * Transformer for updating the deployment target in "project.pbxproj".
     * @param {XcodeProject} project - The content of the file.
     * @returns {void} - The updated content.
     */
    (project: XcodeProject, config: BuildConfig): void => {
      if (!config.ios.deploymentTarget) return;

      project.addToBuildSettings(
        "IPHONEOS_DEPLOYMENT_TARGET",
        config.ios.deploymentTarget
      );
    },

    /**
     * Transformer for updating the targeted device family in "project.pbxproj".
     * The default value is 1 - iPhone.
     * @param {XcodeProject} project - The content of the file.
     * @returns {void} - The updated content.
     */
    (project: XcodeProject, config: BuildConfig): void => {
      const { targetedDevices = "1" } = config.ios;

      project.addToBuildSettings(
        "TARGETED_DEVICE_FAMILY",
        `"${targetedDevices}"`
      );
    },

    /**
     * Transformer for updating the frameworks in "project.pbxproj".
     * @param {XcodeProject} project - The content of the file.
     * @returns {void} - The updated content.
     */
    (project: XcodeProject, config: BuildConfig): void => {
      if (!config.ios.frameworks) return;

      const targetKey = project.findTargetKey("app");

      if (!targetKey) {
        throw Error(`[PbxprojTransformerError]: cannot find target "app" uuid`);
      }

      config.ios.frameworks.forEach((it) => {
        if (it.path) {
          const fpath = path.project.resolve(it.path, it.framework);

          return project.addFramework(fpath, {
            customFramework: true,
            target: targetKey,
          });
        }

        return project.addFramework(it.framework, {
          target: targetKey,
        });
      });
    },

    /**
     * Transformer for updating the bundle identifier in "project.pbxproj".
     * This isn't truly needed as the Info.plist CFBundleIdentifier value
     * takes precedence over this value - the Info.plist CFBundleIdentifier
     * is already udpated in the info-plist transformer.
     * @param {XcodeProject} project - The content of the file.
     * @returns {void} - The updated content.
     */
    (project: XcodeProject, config: BuildConfig): void => {
      project.addToBuildSettings(
        "PRODUCT_BUNDLE_IDENTIFIER",
        `"${config.ios.bundleId}"`
      );
    },

    /**
     * Transformer for updating the code signing in "project.pbxproj".
     * @param {XcodeProject} project - The content of the file.
     * @returns {void} - The updated content.
     */
    (project: XcodeProject, config: BuildConfig): void => {
      if (!config.ios.signing) return;

      project.addToBuildSettings(
        "CODE_SIGN_IDENTITY",
        `"${config.ios.signing.distCertType}"`
      );
      project.addToBuildSettings("CODE_SIGN_STYLE", "Manual");
      project.addToBuildSettings(
        "DEVELOPMENT_TEAM",
        `"${config.ios.signing.exportTeamId}"`
      );
      project.addToBuildSettings(
        "PROVISIONING_PROFILE_SPECIFIER",
        `"${config.ios.signing.provisioningProfileName}"`
      );
    },
  ],

  /**
   * The main transform function that applies all specified transformations to the "project.pbxproj" file.
   * @param {BuildConfig} config - The build configuration.
   * @returns {Promise<void>} - The updated content of the "project.pbxproj" file.
   */
  transform: function (
    config: BuildConfig,
    options: PrebuildOptions
  ): Promise<void> {
    return withPbxproj((project) => {
      this.transforms.forEach((it) => it(project, config, options));
    });
  },
});
