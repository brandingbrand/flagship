import { Config } from '../../../types';
import { logError, logInfo } from '../../../helpers';
import * as path from '../../path';
import * as fs from '../../fs';
import * as pods from '../../cocoapods';

export function preLink(config: Config): void {
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
  const podfile = fs.readFileSync(path.ios.podfilePath());
  const adobeSdk = `pod 'AdobeMobileSDK', '~> 4.14.1'`;

  if (podfile.indexOf(adobeSdk) === -1) {
    pods.add([adobeSdk]);
    logInfo('updated Podfile with Adobe Mobile SDK');
  }

  logInfo('finished updating iOS for react-native-adobe-analytics');
}
