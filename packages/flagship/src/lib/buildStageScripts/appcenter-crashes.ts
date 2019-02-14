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
    name: 'appcenter-crashes android patch',
    platforms: [BuildPlatform.android],
    buildStage: BuildStage.afterLink,
    packages: [{
      packageName: 'appcenter-crashes'
    }],
    script: configuration => {
      fs.update(
        path.android.mainApplicationPath(configuration),
        'new AppCenterReactNativeCrashesPackage()',
        `new AppCenterReactNativeCrashesPackage(application,
        getResources().getString(R.string.appCenterCrashes_whenToSendCrashes))`
      );
    }
  }
];
module.exports = buildStageScripts;
