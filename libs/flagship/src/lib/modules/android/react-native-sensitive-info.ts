import { logInfo } from '../../../helpers';
import type { Config } from '../../../types';
import * as fs from '../../fs';
import * as path from '../../path';

/**
 * Patches Android for the module react-native-sensitive-info. In React Native 0.59,
 * MainApplication.java is no longer getting updated during linking so we have to do it manually.
 *
 * @param configuration The project configuration.
 */
export const postLink = (configuration: Config): void => {
  logInfo('patching Android for react-native-sensitive-info');
  const mainApplicationPath = path.android.mainApplicationPath(configuration);

  let mainApplication = fs.readFileSync(mainApplicationPath);

  if (mainApplication.includes('RNSensitiveInfoPackage')) {
    logInfo('react-native-sensitive-info is already linked in MainApplication.java');

    return;
  }

  mainApplication = mainApplication.replace(
    /(import com.facebook.react.ReactApplication;)/,
    '$1\nimport br.com.classapp.RNSensitiveInfo.RNSensitiveInfoPackage;'
  );

  mainApplication = mainApplication.replace(
    /(new MainReactPackage\(\),)/,
    '$1\n                new RNSensitiveInfoPackage(),'
  );

  fs.writeFileSync(mainApplicationPath, mainApplication);
  logInfo('finished patching Android for react-native-sensitive-info');
};
