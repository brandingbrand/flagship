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
  fs.writeFileSync(path.android.gradlePath(), gradleAppBuild);
  logInfo('updated ./android/app/build.gradle');

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
