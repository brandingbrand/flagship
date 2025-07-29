import {default as androidManifestTransform} from './android/android-manifest-xml';
import {default as androidAppBuildGradleTransform} from './android/app-build-gradle';
import {default as androidBuildGradleTransform} from './android/build-gradle';
import {default as androidColorsTransform} from './android/colors-xml';
import {default as androidFSAppEnvSwitcherTransform} from './android/fsapp-env-switcher-java';
import {default as androidFSAppMainApplicationTransform} from './android/fsapp-main-application-java';
import {default as androidFSAppNativeConstantsTransform} from './android/fsapp-native-constants-java';
import {default as androidGemfileTransform} from './android/gemfile';
import {default as androidGradlePropertiesTransform} from './android/gradle-properties';
import {default as androidStringsTransform} from './android/strings-xml';
import {default as androidStylesTransform} from './android/styles-xml';
import {default as iosAppDelegateTransform} from './ios/app-delegate-mm';
import {default as iosAppEntitlementsTransform} from './ios/app-entitlements';
import {default as iosFSAppEnvSwitcherTransform} from './ios/fsapp-env-switcher-m';
import {default as iosFSAppNativeConstantsTransform} from './ios/fsapp-native-constants-m';
import {default as iosFSAppPbxprojTransform} from './ios/fsapp-project-pbxproj';
import {default as iosGemfileTransform} from './ios/gemfile';
import {default as iosInfoPlistTransform} from './ios/info-plist';
import {default as iosPodfileTransform} from './ios/podfile';
import {default as iosPrivacyInfoTransform} from './ios/privacy-info-xcprivacy';
import {default as iosPbxprojTransform} from './ios/project-pbxproj';

export const transforms072 = {
  androidColorsTransform,
  androidStylesTransform,
  androidGemfileTransform,
  androidStringsTransform,
  androidManifestTransform,
  androidBuildGradleTransform,
  androidAppBuildGradleTransform,
  androidGradlePropertiesTransform,
  iosAppDelegateTransform,
  iosAppEntitlementsTransform,
  iosGemfileTransform,
  iosInfoPlistTransform,
  iosPodfileTransform,
  iosPrivacyInfoTransform,
  iosPbxprojTransform,
  // FSApp-specific transforms
  androidFSAppEnvSwitcherTransform,
  androidFSAppMainApplicationTransform,
  androidFSAppNativeConstantsTransform,
  iosFSAppEnvSwitcherTransform,
  iosFSAppNativeConstantsTransform,
  iosFSAppPbxprojTransform,
};
