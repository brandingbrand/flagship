// tslint:disable ter-max-len max-line-length

import { Config, IOSPermissionKeys, UsageDescriptionIOS } from '../../../types';
import { logInfo } from '../../../helpers';
import * as pods from '../../cocoapods';
import * as usageDescriptionsHelper from '../../usage-descriptions';

interface IOSPermissionMeta {
  pod: string;
  usageDescriptionKey?: string;
}

// Object specifying the pod definition and iOS usage description key for each possible
// type of permission available in react-native-permissions
const permissionPods: {[k in IOSPermissionKeys]: IOSPermissionMeta} = {
  APP_TRACKING_TRANSPARENCY: {
    pod: 'pod \'Permission-AppTrackingTransparency\', :path => "../node_modules/react-native-permissions/ios/AppTrackingTransparency.podspec"',
    usageDescriptionKey: 'NSAppleMusicUsageDescription'
  },
  BLUETOOTH_PERIPHERAL: {
    pod: 'pod \'Permission-BluetoothPeripheral\', :path => "../node_modules/react-native-permissions/ios/BluetoothPeripheral.podspec"',
    usageDescriptionKey: 'NSBluetoothPeripheralUsageDescription'
  },
  CALENDARS: {
    pod: 'pod \'Permission-Calendars\', :path => "../node_modules/react-native-permissions/ios/Calendars.podspec"',
    usageDescriptionKey: 'NSCalendarsUsageDescription'
  },
  CAMERA: {
    pod: 'pod \'Permission-Camera\', :path => "../node_modules/react-native-permissions/ios/Camera.podspec"',
    usageDescriptionKey: 'NSCameraUsageDescription'
  },
  CONTACTS: {
    pod: 'pod \'Permission-Contacts\', :path => "../node_modules/react-native-permissions/ios/Contacts.podspec"',
    usageDescriptionKey: 'NSContactsUsageDescription'
  },
  FACE_ID: {
    pod: 'pod \'Permission-FaceID\', :path => "../node_modules/react-native-permissions/ios/FaceID.podspec"',
    usageDescriptionKey: 'NSFaceIDUsageDescription'
  },
  LOCATION_ALWAYS: {
    pod: 'pod \'Permission-LocationAlways\', :path => "../node_modules/react-native-permissions/ios/LocationAlways.podspec"',
    usageDescriptionKey: 'NSLocationAlwaysAndWhenInUseUsageDescription'
  },
  LOCATION_WHEN_IN_USE: {
    pod: 'pod \'Permission-LocationWhenInUse\', :path => "../node_modules/react-native-permissions/ios/LocationWhenInUse.podspec"',
    usageDescriptionKey: 'NSLocationWhenInUseUsageDescription'
  },
  MEDIA_LIBRARY: {
    pod: 'pod \'Permission-MediaLibrary\', :path => "../node_modules/react-native-permissions/ios/MediaLibrary.podspec"',
    usageDescriptionKey: 'NSAppleMusicUsageDescription'
  },
  MICROPHONE: {
    pod: 'pod \'Permission-Microphone\', :path => "../node_modules/react-native-permissions/ios/Microphone.podspec"',
    usageDescriptionKey: 'NSMicrophoneUsageDescription'
  },
  MOTION: {
    pod: 'pod \'Permission-Motion\', :path => "../node_modules/react-native-permissions/ios/Motion.podspec"',
    usageDescriptionKey: 'NSMotionUsageDescription'
  },
  NOTIFICATIONS: {
    pod: 'pod \'Permission-Notifications\', :path => "../node_modules/react-native-permissions/ios/Notifications.podspec"'
  },
  PHOTO_LIBRARY: {
    pod: 'pod \'Permission-PhotoLibrary\', :path => "../node_modules/react-native-permissions/ios/PhotoLibrary.podspec"',
    usageDescriptionKey: 'NSPhotoLibraryUsageDescription'
  },
  REMINDERS: {
    pod: 'pod \'Permission-Reminders\', :path => "../node_modules/react-native-permissions/ios/Reminders.podspec"',
    usageDescriptionKey: 'NSRemindersUsageDescription'
  },
  SIRI: {
    pod: 'pod \'Permission-Siri\', :path => "../node_modules/react-native-permissions/ios/Siri.podspec"',
    usageDescriptionKey: 'NSSiriUsageDescription'
  },
  SPEECH_RECOGNITION: {
    pod: 'pod \'Permission-SpeechRecognition\', :path => "../node_modules/react-native-permissions/ios/SpeechRecognition.podspec"',
    usageDescriptionKey: 'NSSpeechRecognitionUsageDescription'
  },
  STOREKIT: {
    pod: 'pod \'Permission-StoreKit\', :path => "../node_modules/react-native-permissions/ios/StoreKit.podspec"'
  }
};

export function preLink(config: Config): void {
  logInfo('patching iOS for react-native-permissions');

  if (!config?.permissions?.ios) {
    logInfo('react-native-permissions not configured for iOS');

    return;
  }

  const usageDescriptions: UsageDescriptionIOS[] = [];

  (Object.keys(config.permissions.ios) as IOSPermissionKeys[]).forEach(key => {
    const permission = permissionPods[key];

    if (permission) {
      pods.add([permission.pod]);

      if (permission.usageDescriptionKey) {
        usageDescriptions.push({
          key: permission.usageDescriptionKey,
          string: (config?.permissions?.ios && config.permissions.ios[key]) || ''
        });
      }
    }
  });

  if (usageDescriptions.length > 0) {
    usageDescriptionsHelper.add(config, usageDescriptions);
  }
}
