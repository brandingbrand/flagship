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
    name: 'appcenter android patch',
    platforms: ['android'],
    lifeCycle: 'afterLink',
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
module.exports = buildHooks;
