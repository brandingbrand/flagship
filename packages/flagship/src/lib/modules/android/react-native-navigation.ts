import * as path from '../../path';
import * as fs from '../../fs';
import { Config } from '../../../types';
import { logInfo } from '../../../helpers';

/**
 * Patches Android for the module.
 *
 * @param {object} configuration The project configuration.
 */
export function postLink(configuration: Config): void {
  logInfo('patching Android for react-native-leanplum');

  fs.update(
    path.android.mainApplicationPath(configuration),
    /\s+new NavigationReactPackage\(\),?/,
    ''
  );

  fs.update(
    path.android.mainApplicationPath(configuration),
    /\s+import com.reactnativenavigation.NavigationReactPackage;/,
    ''
  );
}
