import * as path from '../../path';
import * as fs from '../../fs';
import { Config } from '../../../types';
import {
  logInfo
} from '../../../helpers';

export function postLink(configuration: Config): void {
  // Add dependencies to /android/app/build.gradle and replace compile command with implementation
  // command due to Gradle 3 changes
  let gradleAppBuild = fs.readFileSync(path.android.gradlePath(), { encoding: 'utf8' });

  gradleAppBuild = gradleAppBuild.replace(
    'defaultConfig {',
    `defaultConfig {
        missingDimensionStrategy 'react-native-camera', 'general'`
  );

  fs.writeFileSync(path.android.gradlePath(), gradleAppBuild);
  logInfo('updated ./android/app/build.gradle');

  // Disable aapt2 because it's not causes issues with our image assets. Add
  // android.enableAapt2=false to gradle.properties
  let gradleProps = fs.readFileSync(path.android.gradlePropertiesPath(), { encoding: 'utf8' });
  gradleProps += '\nandroid.enableAapt2=false\n';
  fs.writeFileSync(path.android.gradlePropertiesPath(), gradleProps);
  logInfo('disabled aapt2 in gradle.properties');

  logInfo('finished updating Android for react-native-camera');
}
