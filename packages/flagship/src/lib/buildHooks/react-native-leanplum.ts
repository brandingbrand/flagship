import * as path from '../path';
import * as fs from '../fs';
import * as pods from '../cocoapods';
import { logInfo } from '../../helpers';
import { BuildHook } from '../buildHooks';

const kRepository = `maven { url 'https://repo.leanplum.com/' }`;

const buildHooks: BuildHook[] = [
  {
    name: 'react-native-leanplum ios patch',
    platforms: ['android'],
    lifeCycle: 'afterLink',
    packages: [{
      packageName: 'react-native-leanplum'
    }],
    script: configuration => {
      logInfo('patching Android for react-native-leanplum');

      // Add the repository to the project repositories.
      fs.update(path.android.gradlePath(),
        'repositories {', `repositories {\n        ${kRepository}`);

      fs.update(
        path.android.mainApplicationPath(configuration),
        'new RNLeanplumPackage()',
        'new RNLeanplumPackage(application)'
      );
    }
  },
  {
    name: 'react-native-leanplum ios pod version temporary locking',
    platforms: ['ios'],
    lifeCycle: 'beforeIOSPodInstall',
    packages: [{
      packageName: 'react-native-leanplum'
    }],
    script: configuration => {
      pods.add(path.ios.podfilePath(), [`pod "Leanplum-iOS-SDK", '2.1.0'`]);
    }
  }
];

module.exports = buildHooks;
