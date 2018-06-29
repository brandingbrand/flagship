import * as path from '../path';
import * as fs from '../fs';
import { logInfo } from '../../helpers';
import { Config } from '../../types';

/**
 * Patches Android for the module.
 *
 * @param {object} configuration The project configuration.
 */
exports.android = function installAndroid(configuration: Config): void {
  logInfo('patching Android for appcenter-analytics');

  fs.update(
    path.android.mainApplicationPath(configuration),
    'new AppCenterReactNativeAnalyticsPackage()',
    `new AppCenterReactNativeAnalyticsPackage(application,
      getResources().getString(R.string.appCenterAnalytics_whenToEnableAnalytics))`
  );
};
