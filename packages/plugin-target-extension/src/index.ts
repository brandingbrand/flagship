/// <reference types="@brandingbrand/code-cli-kit/types" />

/**
 * Defines a plugin for @brandingbrand/code-cli-kit.
 * @module Plugin
 */

import {
  type BuildConfig,
  type PrebuildOptions,
  definePlugin,
  withPbxproj,
  path,
  fs,
} from "@brandingbrand/code-cli-kit";
import fse from "fs-extra";

import type { CodePluginTargetExtension } from "./types";

/**
 * Defines a plugin with functions for both iOS and Android platforms.
 * @alias module:Plugin
 * @param {BuildConfig & CodePluginTargetExtension} build - The build configuration object.
 * @param {PrebuildOptions} options - The options object.
 */
export default definePlugin<CodePluginTargetExtension>({
  /**
   * Function to be executed for iOS platform.
   * @param {BuildConfig & CodePluginTargetExtension} build - The build configuration object for iOS.
   * @param {PrebuildOptions} options - The options object for iOS.
   * @returns {Promise<void>} A promise that resolves when the process completes.
   */
  ios: async function (
    build: BuildConfig & CodePluginTargetExtension,
    options: PrebuildOptions
  ): Promise<void> {
    // Extracting the extensions from build object
    const extensions = build.codePluginTargetExtension.plugin;

    for (const extension of extensions) {
      const { assetsPath, bundleId, provisioningProfileName } = extension;

      // Getting the base name of the assetsPath
      const name = path.basename(assetsPath);
      // Reading files from assetsPath
      const files = await fs.readdir(path.project.resolve(assetsPath));
      // Filtering entitlements file from files
      const entitlementsFile = files.filter((it) =>
        it.match(/(\w+\.entitlements)/)
      )[0];
      // Filtering source files from files
      const sourceFiles = files.filter((it) => it.match(/(\w+\.(m|mm|swift))/));

      await fse.copy(
        path.project.resolve(assetsPath),
        path.project.resolve("ios", "app")
      );

      // Check to see if entitlements exists otherwise throw error as signing will file in continuous integration
      if (!entitlementsFile) {
        throw Error(
          `[CodePluginTargetExtensionError]: cannot find *.entitlements in ${path.project.resolve(assetsPath)}`
        );
      }

      // Performing operations with Xcode project file
      await withPbxproj((project) => {
        // Finding target key for 'app' in the format of uuid
        const targetKey = project.findTargetKey("app");

        // Throw error if the target key does not exist as you won't able to manipulate the target
        if (!targetKey) {
          throw Error(
            "[CodePluginTargetExtension]: cannot find target 'app' uuid"
          );
        }

        // Finding the groupe key for 'app' in the format of uuid
        const groupKey = project.findPBXGroupKey({ name: "app" });

        // Throw error if group key does not exist as you won't be able to manipulate group
        if (!groupKey) {
          throw Error(
            "[CodePluginTargetExtension]: cannot find group 'app' uuid"
          );
        }

        // Create new group with source files
        const { uuid: extensionGroupUuid } = project.addPbxGroup(
          files,
          name,
          "app"
        );

        // Add the extension group to app group
        project.addToPbxGroup(extensionGroupUuid, groupKey);

        // Create new target for app extension
        const { uuid: extensionTargetUuid } = project.addTarget(
          name,
          "app_extension",
          name,
          bundleId
        );

        // Adding build phase for source files
        project.addBuildPhase(
          sourceFiles,
          "PBXSourcesBuildPhase",
          "Sources",
          extensionTargetUuid,
          undefined,
          undefined
        );

        // Adding build pahse for frameworks
        project.addBuildPhase(
          [],
          "PBXFrameworksBuildPhase",
          "Frameworks",
          extensionTargetUuid,
          undefined,
          undefined
        );

        // Adding build phase for resource files
        project.addBuildPhase(
          [],
          "PBXResourcesBuildPhase",
          "Resources",
          extensionTargetUuid,
          undefined,
          undefined
        );

        // Required build settings for code signing - more important for continuous integration
        const buildSettings = {
          PRODUCT_BUNDLE_SHORT_VERSION_STRING:
            build.ios.versioning?.version ?? "1.0",
          PRODUCT_BUNDLE_VERSION: build.ios.versioning?.build ?? 1,
          CODE_SIGN_STYLE: "Manual",
          CODE_SIGN_IDENTITY: `"${build.ios.signing?.distCertType}"`,
          PROVISIONING_PROFILE_SPECIFIER: `"${provisioningProfileName}"`,
          DEVELOPMENT_TEAM: build.ios.signing?.exportTeamId,
          CODE_SIGN_ENTITLEMENTS: `${name}/${entitlementsFile[0]}`,
        };

        // Add code signing build properties to extension target
        Object.entries(buildSettings).forEach(([key, value]) => {
          project.updateBuildProperty(key, value, null, `"${name}"`);
        });
      });
    }
  },
});

export type { CodePluginTargetExtension };
