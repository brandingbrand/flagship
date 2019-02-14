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
    name: 'appcenter-analytics android patch',
    platforms: [BuildPlatform.android],
    buildStage: BuildStage.afterLink,
    packages: [{
      packageName: 'appcenter-analytics'
    }],
    script: configuration => {
      fs.update(
        path.android.mainApplicationPath(configuration),
        'new AppCenterReactNativeAnalyticsPackage()',
        `new AppCenterReactNativeAnalyticsPackage(application,
        getResources().getString(R.string.appCenterAnalytics_whenToEnableAnalytics))`
      );
    }
  }
];
module.exports = buildStageScripts;
