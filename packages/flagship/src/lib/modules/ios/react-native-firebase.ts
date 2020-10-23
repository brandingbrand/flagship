import * as path from '../../path';
import * as fs from '../../fs';
import * as pods from '../../cocoapods';
import { Config } from '../../../types';
import {
  logError,
  logInfo
} from '../../../helpers';

export function preLink(configuration: Config): void {
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
  const firebasePod = `pod 'Firebase/Core', '6.13.0'`;

  if (podfile.indexOf(firebasePod) === -1) {
    pods.add([firebasePod]);
    logInfo('updated Podfile with Firebase pod');
  }

  // Firebase includes GoogleAppMeasurement as a dependency automatically, but the latest version
  // 5.4.0 was compiled with Xcode 10 which is not yet supported by Flagship
  const googleMeasurementPod = `pod 'GoogleAppMeasurement', '6.1.6'`;

  if (podfile.indexOf(googleMeasurementPod) === -1) {
    pods.add([googleMeasurementPod]);
    logInfo('updated Podfile with GoogleAppMeasurement pod');
  }

  logInfo('finished updating iOS for firebase');
}
