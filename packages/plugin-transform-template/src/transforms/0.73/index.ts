import {transforms072} from '../0.72';

import {default as androidBuildGradleTransform} from './android/build-gradle';
import {default as androidFSAppMainApplicationTransform} from './android/fsapp-main-application-kt';
import {default as iosPbxprojTransform} from './ios/project-pbxproj';

export const transforms073 = {
  ...transforms072,
  androidBuildGradleTransform,
  androidFSAppMainApplicationTransform,
  iosPbxprojTransform,
};
