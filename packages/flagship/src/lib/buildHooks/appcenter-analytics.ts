import * as path from '../path';
import * as fs from '../fs';
import { BuildHook } from '../buildHooks';

/**
 * Patches Android for the module.
 *
 * @param {object} configuration The project configuration.
 */
const buildHooks: BuildHook[] = [
  {
    name: 'appcenter-analytics android patch',
    platforms: ['android'],
    lifeCycle: 'afterLink',
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
module.exports = buildHooks;
