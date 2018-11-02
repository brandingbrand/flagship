import * as path from '../path';
import * as fs from '../fs';
import * as pods from '../cocoapods';
import { Config } from '../../types';
import {
  logError,
  logInfo
} from '../../helpers';

export function android(config: Config): void {
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
}

export async function ios(config: Config): Promise<void> {
  if (
    !config.adobeAnalytics ||
    !config.adobeAnalytics.ios ||
    !config.adobeAnalytics.ios.configPath
  ) {
    logError('adobeAnalytics.ios.configPath must be specified in project config');
    return process.exit(1);
  }

  logInfo('Coping ADBMobileConfig.json to iOS folder');
  const destination = path.resolve(path.ios.nativeProjectPath(config), 'ADBMobileConfig.json');
  const source = path.project.resolve(config.adobeAnalytics.ios.configPath);
  fs.copySync(source, destination);
  logInfo('Sucessfully copied ADBMobileConfig.json to iOS folder');

  // Add Adobe Mobile SDK Podfile
  const podfile = fs.readFileSync(path.ios.podfilePath(), { encoding: 'utf-8' });
  const adobeSdk = `pod 'AdobeMobileSDK', '~> 4.14.1'`;

  if (podfile.indexOf(adobeSdk) === -1) {
    pods.add(path.ios.podfilePath(), [adobeSdk]);
    pods.install();
    logInfo('updated Podfile with Adobe Mobile SDK');
  }

  logInfo('finished updating iOS for react-native-adobe-analytics');
}
