import {transforms075} from '../0.75';

import {default as iosAppDelegateTransform} from './ios/app-delegate-swift';
import {default as iosPbxprojTransform} from './ios/project-pbxproj';
import {default as iosPodfileTransform} from './ios/podfile';
import {default as androidGradlePropertiesTransform} from './android/gradle-properties';

export const transforms077 = {
  ...transforms075,
  iosAppDelegateTransform,
  iosPbxprojTransform,
  iosPodfileTransform,
  androidGradlePropertiesTransform,
};
