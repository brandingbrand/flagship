/* tslint:disable:max-line-length ter-max-len */
import * as path from '../path';
import * as fs from '../fs';
import { logInfo } from '../../helpers';
import { Config } from '../../types';

/**
 * Patches Android for the module.
 *
 * @param {object} configuration The project configuration.
 */
exports.android = function installAndroid(configuration: Config): void {
  logInfo('patching Android for react-native-fcm');

  const globalGradle = path.resolve('android', 'build.gradle');
  const appGradle = path.android.gradlePath();

  // create google-services.json
  if (!configuration.firebaseGoogleServices) {
    throw new Error('Google Services config is missing.');
  }

  console.log(path.resolve('android', 'app', 'google-services.json'));
  fs.writeFileSync(path.resolve('android', 'app', 'google-services.json'), JSON.stringify(configuration.firebaseGoogleServices, null, 2));

  // add google-services to global gradle
  fs.update(globalGradle, '// [Init Script Deps]', `// [Init Script Deps]
        classpath 'com.google.gms:google-services:3.1.2'`);

  // add google-services to app gradle
  fs.update(appGradle, '// [Init Script EOF]', `// [Init Script EOF]
apply plugin: 'com.google.gms.google-services'`);
  // update sdk version
  fs.update(appGradle, 'compileSdkVersion 26', 'compileSdkVersion 27');
  fs.update(appGradle, 'targetSdkVersion 24', 'targetSdkVersion 27');
  fs.update(appGradle, 'buildToolsVersion "26.0.2"', 'buildToolsVersion "27.0.3"');
  // add fcm and firebase deps
  fs.update(appGradle, "compile project(':react-native-fcm')", `compile project(':react-native-fcm')
    compile 'com.google.firebase:firebase-core:15.+'
    compile 'com.google.firebase:firebase-messaging:15.+'`);

  // add intent filters and icons to manifest
  let icon = '';
  if (configuration.pushIcons && configuration.pushIcons.android) {
    icon = `<meta-data android:name="com.google.firebase.messaging.default_notification_icon" android:resource="@mipmap/${configuration.pushIcons.android}"/>`;
  }
  fs.update(path.android.manifestPath(), '</application>', `

  ${icon}

  <service android:name="com.evollu.react.fcm.MessagingService" android:enabled="true" android:exported="true">
    <intent-filter>
      <action android:name="com.google.firebase.MESSAGING_EVENT"/>
    </intent-filter>
  </service>

  <service android:name="com.evollu.react.fcm.InstanceIdService" android:exported="false">
    <intent-filter>
      <action android:name="com.google.firebase.INSTANCE_ID_EVENT"/>
    </intent-filter>
  </service>

  </application>`);

  // intent bugfix
  fs.update(path.android.mainActivityPath(configuration), 'import android.os.Bundle;', `import android.os.Bundle;
import android.content.Intent;`);
  fs.update(path.android.mainActivityPath(configuration), 'public static Activity getActivity(){', `
@Override
    public void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
    }
    public static Activity getActivity(){`);
};
