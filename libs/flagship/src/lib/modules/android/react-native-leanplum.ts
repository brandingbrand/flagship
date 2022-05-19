import { logInfo } from '../../../helpers';
import type { Config } from '../../../types';
import * as fs from '../../fs';
import * as path from '../../path';

const kRepository = `maven { url 'https://repo.leanplum.com/' }`;

/**
 * Patches Android for the module.
 *
 * @param configuration The project configuration.
 */
export const postLink = (configuration: Config): void => {
  logInfo('patching Android for react-native-leanplum');

  // Add the repository to the project repositories.
  fs.update(path.android.gradlePath(), 'repositories {', `repositories {\n        ${kRepository}`);

  fs.update(
    path.android.mainApplicationPath(configuration),
    'new RNLeanplumPackage()',
    'new RNLeanplumPackage(application)'
  );
};
