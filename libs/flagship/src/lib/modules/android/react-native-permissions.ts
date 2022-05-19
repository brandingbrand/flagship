import { logInfo } from '../../../helpers';
import type { Config } from '../../../types';
import * as fs from '../../fs';
import * as path from '../../path';

export const postLink = (configuration: Config): void => {
  logInfo('patching Android for react-native-permissions');

  if (!configuration.permissions?.android) {
    logInfo('react-native-permissions not configured for Android');
  }

  let manifestPermissions = '';

  if (configuration.permissions?.android) {
    for (const permission of configuration.permissions.android) {
      manifestPermissions +=
        permission === 'ADD_VOICEMAIL'
          ? `\n    <uses-permission android:name="com.android.voicemail.permission.ADD_VOICEMAIL" />`
          : `\n    <uses-permission android:name="android.permission.${permission}" />`;
    }
  }

  if (manifestPermissions) {
    fs.update(
      path.android.manifestPath(),
      '<!-- __ADDITIONAL_PERMISSIONS__ -->',
      `${manifestPermissions}\n    <!-- __ADDITIONAL_PERMISSIONS__ -->`
    );
  }
};
