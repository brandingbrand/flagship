import * as path from '../path';
import * as fs from '../fs';
import { Config } from '../../types';
import { logInfo } from '../../helpers';

/**
 * Patches Android for the module.
 *
 * @param {object} configuration The project configuration.
 */
exports.android = function installAndroid(configuration: Config): void {
  logInfo('patching Android for appcenter-crashes');

  fs.update(
    path.android.mainApplicationPath(configuration),
    'new AppCenterReactNativeCrashesPackage()',
    `new AppCenterReactNativeCrashesPackage(application,
      getResources().getString(R.string.appCenterCrashes_whenToSendCrashes))`
  );
};
