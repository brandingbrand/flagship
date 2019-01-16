import * as path from '../path';
import * as fs from '../fs';
import { Config } from '../../types';
import {
  logInfo
} from '../../helpers';

export function android(configuration: Config): void {
  // Add dependencies to /android/app/build.gradle and replace compile command with implementation
  // command due to Gradle 3 changes
  let gradleAppBuild = fs.readFileSync(path.android.gradlePath(), { encoding: 'utf8' });

  gradleAppBuild = gradleAppBuild.replace(/compile /g, 'implementation ');
  gradleAppBuild = gradleAppBuild.replace(/compile\(/g, 'implementation(');

  // Exclude com.android.support:support-v4 version conflict
  gradleAppBuild = gradleAppBuild.replace(
    /implementation project\(':react-native-camera'\)$/gmi,
    `implementation (project(':react-native-camera')) {
      exclude group: "com.android.support"
    }`
  );

  fs.writeFileSync(path.android.gradlePath(), gradleAppBuild);
  logInfo('updated ./android/app/build.gradle');

  // Disable aapt2 because it's not causes issues with our image assets. Add
  // android.enableAapt2=false to gradle.properties
  let gradleProps = fs.readFileSync(path.android.gradlePropertiesPath(), { encoding: 'utf8' });
  gradleProps += '\nandroid.enableAapt2=false\n';
  fs.writeFileSync(path.android.gradlePropertiesPath(), gradleProps);
  logInfo('disabled aapt2 in gradle.properties');

  // Add dependencies to /android/build.gradle and update gradle version to 3.1.3
  let gradleBuild = fs.readFileSync(path.resolve('android', 'build.gradle'), { encoding: 'utf8' });
  gradleBuild = gradleBuild.replace(
    /(com\.android\.tools\.build:gradle:)[\d\.]+/,
    '$13.1.3'
  );

  fs.writeFileSync(path.resolve('android', 'build.gradle'), gradleBuild);
  logInfo('updated ./android/build.gradle');

  logInfo('finished updating Android for react-native-camera');
}
