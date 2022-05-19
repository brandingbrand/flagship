import { logError, logInfo } from '../../../helpers';
import type { Config } from '../../../types';
import * as fs from '../../fs';
import * as path from '../../path';

export const postLink = (config: Config): void => {
  if (
    !config.adobeAnalytics ||
    !config.adobeAnalytics.android ||
    !config.adobeAnalytics.android.configPath
  ) {
    logError('adobeAnalytics.android.configPath must be specified in project config');
    return process.exit(1);
  }

  logInfo('Coping ADBMobileConfig.json to Android assets folder');
  const destination = path.resolve(path.android.assetsPath(), 'ADBMobileConfig.json');
  const source = path.project.resolve(config.adobeAnalytics.android.configPath);
  fs.copySync(source, destination);

  logInfo('finished updating Android for react-native-adobe-analytics');
};
