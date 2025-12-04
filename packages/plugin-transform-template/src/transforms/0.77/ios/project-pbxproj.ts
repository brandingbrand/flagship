/// <reference types="@brandingbrand/code-cli-kit/types"/>

import type {XcodeProject, PBXFile} from 'xcode';

import {default as projectPbxproj073} from '../../0.73/ios/project-pbxproj';

export default {
  ...projectPbxproj073,
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

    // PrivacyInfo.xcprivacy is already included in the React Native 0.73 template from
    // https://github.com/facebook/react-native/blob/v0.73.9/packages/react-native/template/ios/HelloWorld/PrivacyInfo.xcprivacy

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

    // Required build setting when adding entitlements
    project.addToBuildSettings(
      'CODE_SIGN_ENTITLEMENTS',
      'app/app.entitlements',
    );
  },
};
