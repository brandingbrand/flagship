import {transforms072} from '../0.72';

import {default as androidBuildGradle} from './android/build-gradle';
import {default as androidMainApplication} from './android/main-application-kt';
import {default as iosPbxprojTransform} from './ios/project-pbxproj';

export const transforms073 = {
  ...transforms072,
  androidBuildGradle,
  androidMainApplication,
  iosPbxprojTransform,
};
