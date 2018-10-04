import * as path from '../path';
import * as fs from '../fs';
import * as pods from '../cocoapods';
import { Config } from '../../types';
import {
  logError,
  logInfo,
  logWarn
} from '../../helpers';

export function android(configuration: Config): void {
  if (!(configuration.firebase
        && configuration.firebase.android
        && configuration.firebase.android.googleServicesJsonFile)
  ) {
    logError('firebase.android.googleServicesJsonFile must be specified in project config');

    return process.exit(1);
  }

  // Copy google-services.json to <project root>/android
  const jsonFilePath = path.project.resolve(configuration.firebase.android.googleServicesJsonFile);
  fs.copySync(jsonFilePath, path.resolve('android', 'app', 'google-services.json'));
  logInfo('copied google-services.json into ./android/');

  // Disable aapt2 because it's not compatible with the Firebase install. Add
  // android.enableAapt2=false to gradle.properties
  let gradleProps = fs.readFileSync(path.android.gradlePropertiesPath(), { encoding: 'utf8' });
  gradleProps += '\nandroid.enableAapt2=false\n';
  fs.writeFileSync(path.android.gradlePropertiesPath(), gradleProps);
  logInfo('disabled aapt2 in gradle.properties');

  // Add dependencies to /android/app/build.gradle and replace compile command with implementation
  // command due to Gradle 3 changes
  const firebaseDep = `
    implementation 'com.google.firebase:firebase-core:16.0.1'
      `;

  let gradleAppBuild = fs.readFileSync(path.android.gradlePath(), { encoding: 'utf8' });

  gradleAppBuild = gradleAppBuild.replace(
    /(com.google.android.gms:play-services-base:.+)/,
    `$1\n    ${firebaseDep}`
  );

  gradleAppBuild += '\napply plugin: \'com.google.gms.google-services\'';
  // tslint:disable-next-line:ter-max-len
  gradleAppBuild += '\ncom.google.gms.googleservices.GoogleServicesPlugin.config.disableVersionCheck = true\n';
  gradleAppBuild = gradleAppBuild.replace(/compile /g, 'implementation ');
  gradleAppBuild = gradleAppBuild.replace(/compile\(/g, 'implementation(');
  fs.writeFileSync(path.android.gradlePath(), gradleAppBuild);
  logInfo('updated ./android/app/build.gradle');

  // Add dependencies to /android/build.gradle and update gradle version to 3.1.3
  let gradleBuild = fs.readFileSync(path.resolve('android', 'build.gradle'), { encoding: 'utf8' });
  const servicesDep = `classpath 'com.google.gms:google-services:4.0.1'`;

  if (gradleBuild.indexOf(servicesDep) > -1) {
    return logWarn('Firebase already imported into Android project');
  }

  gradleBuild = gradleBuild.replace(/(dependencies\s*?{\s*?$)/m, `$1\n        ${servicesDep}`);

  gradleBuild = gradleBuild.replace(
    /(buildscript[\s\S]+?repositories\s*?{)/,
    `$1\n        google()`
  );

  gradleBuild = gradleBuild.replace(
    /(allprojects[\s\S]+?repositories[\s\S]+?mavenLocal\s*?\(\s*?\))/,
    `$1\n        google()`
  );

  gradleBuild = gradleBuild.replace(
    /(com\.android\.tools\.build:gradle:)[\d\.]+/,
    '$13.1.3'
  );

  fs.writeFileSync(path.resolve('android', 'build.gradle'), gradleBuild);
  logInfo('updated ./android/build.gradle');

  // Update MainApplication.java
  let mainApplication = fs.readFileSync(
    path.android.mainApplicationPath(configuration),
    { encoding: 'utf8' }
  );

  mainApplication = mainApplication.replace(
    /(import io.invertase.firebase.RNFirebasePackage;)/,
    '$1\nimport io.invertase.firebase.analytics.RNFirebaseAnalyticsPackage;'
  );

  mainApplication = mainApplication.replace(
    /(new RNFirebasePackage\(\),)/,
    '$1\n            new RNFirebaseAnalyticsPackage(),'
  );

  fs.writeFileSync(path.android.mainApplicationPath(configuration), mainApplication);
  logInfo('updated MainApplication.java');

  logInfo('finished updating Android for Firebase');
}

export function ios(configuration: Config): void {
  if (!(configuration.firebase
      && configuration.firebase.ios
      && configuration.firebase.ios.googleServicesPlistFile)
   ) {
    logError('firebase.ios.googleServicesPlistFile must be specified in project config');

    return process.exit(1);
  }

  // Copy GoogleService-Info.plist into ./ios/
  fs.copySync(
    configuration.firebase.ios.googleServicesPlistFile,
    path.resolve(path.ios.nativeProjectPath(configuration), 'GoogleService-Info.plist')
  );
  logInfo('copied GoogleService-Info.plist to ./ios/');

  let appDelegate = fs.readFileSync(
    path.ios.appDelegatePath(configuration),
    { encoding: 'utf-8' }
  );

  // Update AppDelegate.m with Firebase import and initialization
  const firebaseImport = '#import <Firebase.h>';

  if (appDelegate.indexOf(firebaseImport) === -1) {
    appDelegate = firebaseImport + '\n' + appDelegate;
    appDelegate = appDelegate.replace(
      /(didFinishLaunchingWithOptions[\s\S]+?{)/,
      '$1\n  [FIRApp configure];'
    );

    fs.writeFileSync(path.ios.appDelegatePath(configuration), appDelegate);
    logInfo('Updated AppDelegate.m');
  }

  // Add Firebase pod to Podfile
  const podfile = fs.readFileSync(path.ios.podfilePath(), { encoding: 'utf-8' });
  const firebasePod = `pod 'Firebase/Core'`;

  if (podfile.indexOf(firebasePod) === -1) {
    pods.add(path.ios.podfilePath(), [firebasePod]);
    pods.install();
    logInfo('updated Podfile with Firebase pod');
  }

  logInfo('finished updating iOS for firebase');
}
