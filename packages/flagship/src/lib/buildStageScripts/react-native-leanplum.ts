import * as path from '../path';
import * as fs from '../fs';
import * as pods from '../cocoapods';
import { BuildPlatform, BuildStage, BuildStageScript } from '../buildStageScripts';

const kRepository = `maven { url 'https://repo.leanplum.com/' }`;

const buildStageScripts: BuildStageScript[] = [
  {
    name: 'react-native-leanplum android patch',
    platforms: [BuildPlatform.android],
    buildStage: BuildStage.afterLink,
    packages: [{
      packageName: /^(@[^\/]+\/)?react-native-leanplum$/
    }],
    script: configuration => {
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
    platforms: [BuildPlatform.ios],
    buildStage: BuildStage.beforeIOSPodInstall,
    packages: [{
      packageName: /^(@[^\/]+\/)?react-native-leanplum$/
    }],
    script: configuration => {
      pods.add(path.ios.podfilePath(), [`pod "Leanplum-iOS-SDK", '2.1.0'`]);
    }
  }
];

module.exports = buildStageScripts;
