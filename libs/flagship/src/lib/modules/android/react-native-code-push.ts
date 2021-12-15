import * as path from '../../path';
import * as fs from '../../fs';
import * as nativeConstants from '../../native-constants';
import { Config } from '../../../types';
import { logError, logInfo } from '../../../helpers';

export function preLink(configuration: Config): void {
  // Stick the Code Push deployment key into strings.xml so it's picked up by react-native-code-
  // push when init is run
  const deploymentKey = configuration.codepush && configuration.codepush.android.deploymentKey;

  if (!deploymentKey) {
    logError('codepush.android.deploymentKey needs to be set in the project env');

    return process.exit(1);
  }

  fs.update(
    path.android.stringsPath(),
    '</resources>',
    '    <string name="reactNativeCodePush_androidDeploymentKey">' +
      deploymentKey +
      '</string>\n</resources>'
  );
}

/**
 * Patches Android for the module.
 *
 * @param {object} configuration The project configuration.
 */
// eslint-disable-next-line complexity
export function postLink(configuration: Config): void {
  logInfo('patching Android for react-native-codepush');

  if (!(configuration.codepush && configuration.codepush.appCenterToken)) {
    logError('codepush.appCenterToken must be specified in project config');
  }

  const assetsPath = path.android.assetsPath();
  const appCenterConfigPath = path.resolve(assetsPath, 'appcenter-config.json');
  const codepush = configuration.codepush;
  const mainApplicationPath = path.android.mainApplicationPath(configuration);

  if (!codepush || !codepush.android) {
    logError('codepush.android needs to be set in the project env');

    return process.exit(1);
  } else if (!codepush.android.appKey) {
    logError('codepush.android.appKey needs to be set in the project env');

    return process.exit(1);
  } else if (!codepush.android.deploymentKey) {
    logError('codepush.android.deploymentKey needs to be set in the project env');

    return process.exit(1);
  }

  // Patch build.gradle (react-native link should do this but is broken on linux)
  const reactGradlePath = 'apply from: "../../node_modules/react-native/react.gradle"';
  const codePushGradlePath =
    'apply from: "../../node_modules/react-native-code-push/android/codepush.gradle"';
  const gradlePath = path.android.gradlePath();
  const gradleContent = fs.readFileSync(gradlePath, { encoding: 'utf8' });
  if (gradleContent.indexOf(codePushGradlePath) < 0) {
    logInfo(`patching codepush into build.gradle`);
    fs.writeFileSync(
      gradlePath,
      gradleContent.replace(
        new RegExp(reactGradlePath, 'g'),
        [reactGradlePath, codePushGradlePath].join('\n')
      )
    );
  }

  // Inject the app key
  fs.ensureDirSync(assetsPath);
  fs.writeFileSync(
    appCenterConfigPath,
    JSON.stringify(
      {
        app_secret: codepush.android.appKey,
      },
      null,
      2
    )
  );

  // Include the readonly Branding Brand app center token ONLY in development
  // builds
  if (
    !configuration.disableDevFeature &&
    configuration.codepush &&
    configuration.codepush.appCenterToken
  ) {
    nativeConstants.addAndroid(
      configuration,
      'AppCenterToken',
      configuration.codepush.appCenterToken
    );
  }

  fs.update(
    mainApplicationPath,
    '// [CODEPUSH FUNCTIONS INJECT]',
    `@Override
    public String getJSBundleFile() {
      return CodePush.getJSBundleFile();
    }`
  );
}
