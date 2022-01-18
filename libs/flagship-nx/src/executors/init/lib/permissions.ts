export type IosPermissionKeys =
  | 'APP_TRACKING_TRANSPARENCY'
  | 'BLUETOOTH_PERIPHERAL'
  | 'CALENDARS'
  | 'CAMERA'
  | 'CONTACTS'
  | 'FACE_ID'
  | 'LOCATION_ALWAYS'
  | 'LOCATION_WHEN_IN_USE'
  | 'MEDIA_LIBRARY'
  | 'MICROPHONE'
  | 'MOTION'
  | 'NOTIFICATIONS'
  | 'PHOTO_LIBRARY'
  | 'REMINDERS'
  | 'SIRI'
  | 'SPEECH_RECOGNITION'
  | 'STOREKIT';

export type AndroidPermissionKeys =
  | 'ACCEPT_HANDOVER'
  | 'ACCESS_BACKGROUND_LOCATION'
  | 'ACCESS_COARSE_LOCATION'
  | 'ACCESS_FINE_LOCATION'
  | 'ACTIVITY_RECOGNITION'
  | 'ADD_VOICEMAIL'
  | 'ANSWER_PHONE_CALLS'
  | 'BODY_SENSORS'
  | 'CALL_PHONE'
  | 'CAMERA'
  | 'GET_ACCOUNTS'
  | 'PROCESS_OUTGOING_CALLS'
  | 'READ_CALENDAR'
  | 'READ_CALL_LOG'
  | 'READ_CONTACTS'
  | 'READ_EXTERNAL_STORAGE'
  | 'READ_PHONE_NUMBERS'
  | 'READ_PHONE_STATE'
  | 'READ_SMS'
  | 'RECEIVE_MMS'
  | 'RECEIVE_SMS'
  | 'RECEIVE_WAP_PUSH'
  | 'RECORD_AUDIO'
  | 'SEND_SMS'
  | 'USE_SIP'
  | 'WRITE_CALENDAR'
  | 'WRITE_CALL_LOG'
  | 'WRITE_CONTACTS'
  | 'WRITE_EXTERNAL_STORAGE';

export interface IosPermissionMetadata {
  pod: string;
  usageDescriptionKey?: string;
}

export const iosPermissionsMetadata: { [k in IosPermissionKeys]: IosPermissionMetadata } = {
  APP_TRACKING_TRANSPARENCY: {
    pod: `pod 'Permission-AppTrackingTransparency', :path => permissions_path + "/AppTrackingTransparency.podspec"`,
    usageDescriptionKey: 'NSUserTrackingUsageDescription',
  },
  BLUETOOTH_PERIPHERAL: {
    pod: `pod 'Permission-BluetoothPeripheral', :path => permissions_path + "/BluetoothPeripheral.podspec"`,
    usageDescriptionKey: 'NSBluetoothPeripheralUsageDescription',
  },
  CALENDARS: {
    pod: `pod 'Permission-Calendars', :path => permissions_path + "/Calendars.podspec"`,
    usageDescriptionKey: 'NSCalendarsUsageDescription',
  },
  CAMERA: {
    pod: `pod 'Permission-Camera', :path => permissions_path + "/Camera.podspec"`,
    usageDescriptionKey: 'NSCameraUsageDescription',
  },
  CONTACTS: {
    pod: `pod 'Permission-Contacts', :path => permissions_path + "/Contacts.podspec"`,
    usageDescriptionKey: 'NSContactsUsageDescription',
  },
  FACE_ID: {
    pod: `pod 'Permission-FaceID', :path => permissions_path + "/FaceID.podspec"`,
    usageDescriptionKey: 'NSFaceIDUsageDescription',
  },
  LOCATION_ALWAYS: {
    pod: `pod 'Permission-LocationAlways', :path => permissions_path + "/LocationAlways.podspec"`,
    usageDescriptionKey: 'NSLocationAlwaysAndWhenInUseUsageDescription',
  },
  LOCATION_WHEN_IN_USE: {
    pod: `pod 'Permission-LocationWhenInUse', :path => permissions_path + "/LocationWhenInUse.podspec"`,
    usageDescriptionKey: 'NSLocationWhenInUseUsageDescription',
  },
  MEDIA_LIBRARY: {
    pod: `pod 'Permission-MediaLibrary', :path => permissions_path + "/MediaLibrary.podspec"`,
    usageDescriptionKey: 'NSAppleMusicUsageDescription',
  },
  MICROPHONE: {
    pod: `pod 'Permission-Microphone', :path => permissions_path + "/Microphone.podspec"`,
    usageDescriptionKey: 'NSMicrophoneUsageDescription',
  },
  MOTION: {
    pod: `pod 'Permission-Motion', :path => permissions_path + "/Motion.podspec"`,
    usageDescriptionKey: 'NSMotionUsageDescription',
  },
  NOTIFICATIONS: {
    pod: `pod 'Permission-Notifications', :path => permissions_path + "/Notifications.podspec"`,
  },
  PHOTO_LIBRARY: {
    pod: `pod 'Permission-PhotoLibrary', :path => permissions_path + "/PhotoLibrary.podspec"`,
    usageDescriptionKey: 'NSPhotoLibraryUsageDescription',
  },
  REMINDERS: {
    pod: 'pod \'Permission-Reminders\', :path => permissions_path + "/Reminders.podspec"',
    usageDescriptionKey: 'NSRemindersUsageDescription',
  },
  SIRI: {
    pod: `pod 'Permission-Siri', :path => permissions_path + "/Siri.podspec"`,
    usageDescriptionKey: 'NSSiriUsageDescription',
  },
  SPEECH_RECOGNITION: {
    pod: `pod 'Permission-SpeechRecognition', :path => permissions_path + "/SpeechRecognition.podspec"`,
    usageDescriptionKey: 'NSSpeechRecognitionUsageDescription',
  },
  STOREKIT: {
    pod: `pod 'Permission-StoreKit', :path => permissions_path + "/StoreKit.podspec"`,
  },
};
