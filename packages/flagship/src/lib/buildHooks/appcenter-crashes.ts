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
    name: 'appcenter-crashes android patch',
    platforms: ['android'],
    lifeCycle: 'afterLink',
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
module.exports = buildHooks;
