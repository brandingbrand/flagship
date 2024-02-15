import type { AndroidPermissions, IOSPermissions } from "./types";

export const ios: IOSPermissions = {
  AppTrackingTransparency: {
    pod: "AppTrackingTransparency",
    usageKey: "NSUserTrackingUsageDescription",
  },
  Bluetooth: {
    pod: "Blueooth",
    usageKey: "NSBluetoothAlwaysUsageDescription",
  },
  BluetoothPeripheral: {
    pod: "Bluetooth",
    usageKey: "NSBluetoothPeripheralUsageDescription",
  },
  Calendars: {
    pod: "Calendars",
    usageKey: "NSCalendarsUsageDescription",
  },
  Camera: {
    pod: "Camera",
    usageKey: "NSCameraUsageDescription",
  },
  Contacts: {
    pod: "Contacts",
    usageKey: "NSContactsUsageDescription",
  },
  FaceID: {
    pod: "FaceID",
    usageKey: "NSFaceIDUsageDescription",
  },
  LocationAccuracy: {
    pod: "LocationAccuracy",
    usageKey: "NSLocationTemporaryUsageDescriptionDictionary",
  },
  LocationAlways: {
    pod: "LocationAlways",
    usageKey: "NSLocationAlwaysAndWhenInUseUsageDescription",
  },
  LocationWhenInUse: {
    pod: "LocationWhenInUse",
    usageKey: "NSLocationWhenInUseUsageDescription",
  },
  MediaLibrary: {
    pod: "MediaLibrary",
  },
  Microphone: {
    pod: "Microphone",
    usageKey: "NSMicrophoneUsageDescription",
  },
  Motion: {
    pod: "Motion",
    usageKey: "NSMotionUsageDescription",
  },
  Notifications: {
    pod: "Notifications",
  },
  PhotoLibrary: {
    pod: "PhotoLibrary",
    usageKey: "NSPhotoLibraryUsageDescription",
  },
  PhotoLibraryAdd: {
    pod: "PhotoLibraryAddOnly",
    usageKey: "NSPhotoLibraryAddUsageDescription",
  },
  Reminders: {
    pod: "Reminders",
    usageKey: "NSRemindersFullAccessUsageDescription",
  },
  Siri: {
    pod: "Siri",
    usageKey: "NSSiriUsageDescription",
  },
  SpeechRecognition: {
    pod: "SpeechRecognition",
    usageKey: "NSSpeechRecognitionUsageDescription",
  },
};

export const android: AndroidPermissions = [
  "ACCEPT_HANDOVER",
  "ACCESS_BACKGROUND_LOCATION",
  "ACCESS_COARSE_LOCATION",
  "ACCESS_FINE_LOCATION",
  "ACCESS_MEDIA_LOCATION",
  "ACTIVITY_RECOGNITION",
  "ADD_VOICEMAIL",
  "ANSWER_PHONE_CALLS",
  "BLUETOOTH_ADVERTISE",
  "BLUETOOTH_CONNECT",
  "BLUETOOTH_SCAN",
  "BODY_SENSORS",
  "BODY_SENSORS_BACKGROUND",
  "CALL_PHONE",
  "CAMERA",
  "GET_ACCOUNTS",
  "NEARBY_WIFI_DEVICES",
  "POST_NOTIFICATIONS",
  "PROCESS_OUTGOING_CALLS",
  "READ_CALENDAR",
  "READ_CALL_LOG",
  "READ_CONTACTS",
  "READ_EXTERNAL_STORAGE",
  "READ_MEDIA_AUDIO",
  "READ_MEDIA_IMAGES",
  "READ_MEDIA_VIDEO",
  "READ_PHONE_NUMBERS",
  "READ_PHONE_STATE",
  "READ_SMS",
  "RECEIVE_MMS",
  "RECEIVE_SMS",
  "RECEIVE_WAP_PUSH",
  "RECORD_AUDIO",
  "SEND_SMS",
  "USE_SIP",
  "UWB_RANGING",
  "WRITE_CALENDAR",
  "WRITE_CALL_LOG",
  "WRITE_CONTACTS",
  "WRITE_EXTERNAL_STORAGE",
] as const;
