import * as path from '../../path';
import * as fs from '../../fs';
import { Config } from '../../../types';
import { logInfo } from '../../../helpers';

const kRepository = `maven { url 'https://repo.leanplum.com/' }`;

/**
 * Patches Android for the module.
 *
 * @param {object} configuration The project configuration.
 */
export function postLink(configuration: Config): void {
  logInfo('patching Android for react-native-leanplum');

  // Add the repository to the project repositories.
  fs.update(path.android.gradlePath(), 'repositories {', `repositories {\n        ${kRepository}`);

  fs.update(
    path.android.mainApplicationPath(configuration),
    'new RNLeanplumPackage()',
    'new RNLeanplumPackage(application)'
  );
}
