// tslint:disable ter-max-len max-line-length

import { logInfo } from '../../../helpers';
import { Config } from '../../../types';
import * as path from '../../path';
import * as fs from '../../fs';

export function postLink(configuration: Config): void {
  logInfo('patching Android for react-native-permissions');

  if (!configuration?.permissions?.android) {
    logInfo('react-native-permissions not configured for Android');
  }

  let manifestPermissions = '';

  configuration?.permissions?.android?.forEach(permission => {
    if (permission === 'ADD_VOICEMAIL') {
      manifestPermissions += `\n    <uses-permission android:name="com.android.voicemail.permission.ADD_VOICEMAIL" />`;
    } else {
      manifestPermissions += `\n    <uses-permission android:name="android.permission.${permission}" />`;
    }
  });

  if (manifestPermissions) {
    fs.update(
      path.android.manifestPath(),
      '<!-- __ADDITIONAL_PERMISSIONS__ -->',
      `${manifestPermissions}\n    <!-- __ADDITIONAL_PERMISSIONS__ -->`
    );
  }
}
