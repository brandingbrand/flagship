/// <reference types="@brandingbrand/code-cli-kit/types"/>

import {type BuildConfig, path} from '@brandingbrand/code-cli-kit';
import type {XcodeProject, PBXFile} from 'xcode';

/**
 * Configuration object for Xcode project (.pbxproj) transformations
 */
export default {
  /** Regular expression to match .pbxproj files */
  __test: /\bproject\.pbxproj$/gm,

  /**
   * Adds required file references to the Xcode project
   * @param project - The Xcode project to modify
   * @throws Error if target or group "app" cannot be found
   */
  addFileReferences: (project: XcodeProject): void => {
    const targetKey = project.findTargetKey('app');

    if (!targetKey) {
      throw Error(`[PbxprojTransformerError]: cannot find target "app" uuid`);
    }

    const opt = {target: targetKey};

    const groupKey = project.findPBXGroupKey({name: 'app'});

    if (!groupKey) {
      throw Error(`[PbxprojTransformerError]: cannot find group "app" uuid`);
    }

    // These files exist as extras and need to be added to pbxproj file as
    // source files or header files
    project.addSourceFile('app/app.swift', opt, groupKey);
    project.addHeaderFile('app/app-Bridging-Header.h', opt, groupKey);

    // Add the PrivacyInfo.xcprivacy privacy manifest for React Native base usage
    // privacy requirements: https://github.com/facebook/react-native/commit/2d84d835342d58bd28b2233f18691846de6933c9
    // Requirement from Apple: https://developer.apple.com/documentation/bundleresources/privacy_manifest_files?language=objc
    project.addResourceFile('app/PrivacyInfo.xcprivacy', opt, groupKey);

    // *.entitlements file can be treated same as a header file with
    // respect to "xcode" module, force lastKnownFileType and defaultEncoding
    // as this is not a detectble filetype by PBXFile.
    // https://github.com/apache/cordova-node-xcode/blob/e594cd453e8f26d8916e4be7bdfb309b8e820e2f/lib/pbxFile.js#L27
    project.addHeaderFile(
      'app/app.entitlements',
      {
        ...opt,
        lastKnownFileType: 'text.plist.entitlements',
        defaultEncoding: 4,
      },
      groupKey,
    ) as PBXFile;

    // Required build setting when utilizing bridging header
    project.addToBuildSettings(
      'SWIFT_OBJC_BRIDGING_HEADER',
      'app/app-Bridging-Header.h',
    );

    // Required build setting when adding entitlements
    project.addToBuildSettings(
      'CODE_SIGN_ENTITLEMENTS',
      'app/app.entitlements',
    );
  },

  /**
   * Sets the iOS deployment target in the project settings
   * @param project - The Xcode project to modify
   * @param config - Build configuration containing iOS settings
   */
  deploymentTarget: (project: XcodeProject, config: BuildConfig): void => {
    if (!config.ios.deploymentTarget) return;

    project.addToBuildSettings(
      'IPHONEOS_DEPLOYMENT_TARGET',
      config.ios.deploymentTarget,
    );
  },

  /**
   * Sets the targeted device family (iPhone/iPad) in project settings
   * @param project - The Xcode project to modify
   * @param config - Build configuration containing iOS settings
   */
  targetedDeviceFamily: (project: XcodeProject, config: BuildConfig): void => {
    const {targetedDevices = '1'} = config.ios;

    project.addToBuildSettings(
      'TARGETED_DEVICE_FAMILY',
      `"${targetedDevices}"`,
    );
  },

  /**
   * Adds framework dependencies to the project
   * @param project - The Xcode project to modify
   * @param config - Build configuration containing iOS framework settings
   * @throws Error if target "app" cannot be found
   */
  frameworks: (project: XcodeProject, config: BuildConfig): void => {
    if (!config.ios.frameworks) return;

    const targetKey = project.findTargetKey('app');

    if (!targetKey) {
      throw Error(`[PbxprojTransformerError]: cannot find target "app" uuid`);
    }

    config.ios.frameworks.forEach(it => {
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
   * Sets the product bundle identifier in project settings
   * @param project - The Xcode project to modify
   * @param config - Build configuration containing iOS bundle ID
   */
  productBundleIdentifier: (
    project: XcodeProject,
    config: BuildConfig,
  ): void => {
    project.addToBuildSettings(
      'PRODUCT_BUNDLE_IDENTIFIER',
      `"${config.ios.bundleId}"`,
    );
  },

  /**
   * Configures code signing settings for the project
   * @param project - The Xcode project to modify
   * @param config - Build configuration containing iOS signing settings
   */
  codeSigning: (project: XcodeProject, config: BuildConfig): void => {
    if (!config.ios.signing) return;

    project.addToBuildSettings(
      'CODE_SIGN_IDENTITY',
      `"${config.ios.signing.distCertType}"`,
    );
    project.addToBuildSettings('CODE_SIGN_STYLE', 'Manual');
    project.addToBuildSettings(
      'DEVELOPMENT_TEAM',
      `"${config.ios.signing.exportTeamId}"`,
    );
    project.addToBuildSettings(
      'PROVISIONING_PROFILE_SPECIFIER',
      `"${config.ios.signing.provisioningProfileName}"`,
    );
  },
};
