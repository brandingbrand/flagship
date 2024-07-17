/**
 * Import necessary modules for iOS transformations from the 'transformers-0.72/ios' directory.
 *
 * PrivacyInfo.xcrprivacy has been excluded from the import because it's part of the default template
 * of React Native 0.73.
 *
 * @link {https://github.com/facebook/react-native/blob/v0.73.9/packages/react-native/template/ios/HelloWorld/PrivacyInfo.xcprivacy}
 *
 * @module iOS/Transformers
 */
import {
  appDelegate,
  entitlements,
  iosEnvSwitcher,
  iosGemfile,
  infoPlist,
  iosNativeConstants,
  podfile,
} from '../../transformers-0.72/ios';

/**
 * Import the project configuration for pbxproj which overrides the React Native 0.72
 * transformers as PrivacyInfo.xcprivacy no longer needs to be added to the pbxproj.
 *
 * @module ProjectPBXProj
 */
import {default as pbxproj} from './project-pbxproj';

/**
 * Export the iOS transformers and project pbxproj configuration.
 * @module Exports
 */
export {
  appDelegate,
  entitlements,
  iosEnvSwitcher,
  iosGemfile,
  infoPlist,
  iosNativeConstants,
  podfile,
  pbxproj,
};
