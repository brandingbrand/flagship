import * as path from '../path';
import * as fs from '../fs';
import { BuildPlatform, BuildStage, BuildStageScript } from '../buildStageScripts';

/**
 * Patches Android for the module.
 *
 * @param {object} configuration The project configuration.
 */
const buildStageScripts: BuildStageScript[] = [
  {
    name: 'appcenter android patch',
    platforms: [BuildPlatform.android],
    buildStage: BuildStage.afterLink,
    packages: [{
      packageName: 'appcenter'
    }],
    script: configuration => {
      fs.update(
        path.android.mainApplicationPath(configuration),
        'new AppCenterReactNativePackage()',
        'new AppCenterReactNativePackage(application)'
      );
    }
  }
];
module.exports = buildStageScripts;
