import * as path from '../../path';
import * as fs from '../../fs';
import * as nativeConstants from '../../native-constants';
import { Config } from '../../../types';
import { logError, logInfo } from '../../../helpers';

/**
 * Patches iOS for the module.
 *
 * @param {object} configuration The project configuration.
 */
export function preLink(configuration: Config): void {
  logInfo('patching iOS for react-native-codepush');

  if (!(configuration.codepush && configuration.codepush.appCenterToken)) {
    logError('codepush.appCenterToken must be specified in project config');
  }

  const appCenterConfigPath = path.resolve(
    path.ios.nativeProjectPath(configuration),
    'AppCenter-Config.plist'
  );

  if (!configuration.codepush || !configuration.codepush.ios) {
    logError('codepush.ios needs to be set in the project env');

    return process.exit(1);
  } else if (!configuration.codepush.ios.appKey) {
    logError('codepush.ios.appKey needs to be set in the project env');

    return process.exit(1);
  } else if (!configuration.codepush.ios.deploymentKey) {
    logError('codepush.ios.deploymentKey needs to be set in the project env');

    return process.exit(1);
  }

  // Inject the app key
  fs.update(appCenterConfigPath, 'CODEPUSH_APP_KEY', configuration.codepush.ios.appKey);

  // Include the readonly Branding Brand app center token ONLY in development
  // builds
  if (
    !configuration.disableDevFeature &&
    configuration.codepush &&
    configuration.codepush.appCenterToken
  ) {
    nativeConstants.addIOS(configuration, 'AppCenterToken', configuration.codepush.appCenterToken);
  }

  // Add the Code Push deployment key to Info.plist so react-native-code-push picks it up when
  // react native init is run
  fs.update(
    path.ios.infoPlistPath(configuration),
    '<dict>',
    `<dict>
  <key>CodePushDeploymentKey</key>
  <string>${configuration.codepush.ios.deploymentKey}</string>`
  );
}
