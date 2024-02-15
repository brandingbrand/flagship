/**
 * Represents a set of iOS permissions.
 */
export const ios = {
  /**
   * Permission for accessing App Tracking Transparency.
   */
  AppTrackingTransparency: {
    pod: "AppTrackingTransparency",
    usageKey: "NSUserTrackingUsageDescription",
    purposeKey: undefined,
  },
  /**
   * Permission for Bluetooth access.
   */
  Bluetooth: {
    pod: "Blueooth",
    usageKey: "NSBluetoothAlwaysUsageDescription",
    purposeKey: undefined,
  },
  /**
   * Permission for Bluetooth peripheral access.
   */
  BluetoothPeripheral: {
    pod: "Bluetooth",
    usageKey: "NSBluetoothPeripheralUsageDescription",
    purposeKey: undefined,
  },
  /**
   * Permission for accessing calendars.
   */
  Calendars: {
    pod: "Calendars",
    usageKey: "NSCalendarsUsageDescription",
    purposeKey: undefined,
  },
  /**
   * Permission for accessing the camera.
   */
  Camera: {
    pod: "Camera",
    usageKey: "NSCameraUsageDescription",
    purposeKey: undefined,
  },
  /**
   * Permission for accessing contacts.
   */
  Contacts: {
    pod: "Contacts",
    usageKey: "NSContactsUsageDescription",
    purposeKey: undefined,
  },
  /**
   * Permission for accessing Face ID.
   */
  FaceID: {
    pod: "FaceID",
    usageKey: "NSFaceIDUsageDescription",
    purposeKey: undefined,
  },
  /**
   * Permission for accessing precise location.
   */
  LocationAccuracy: {
    pod: "LocationAccuracy",
    usageKey: "NSLocationTemporaryUsageDescriptionDictionary",
    purposeKey: "REQUIRED",
  },
  /**
   * Permission for always accessing location.
   */
  LocationAlways: {
    pod: "LocationAlways",
    usageKey: "NSLocationAlwaysAndWhenInUseUsageDescription",
    purposeKey: undefined,
  },
  /**
   * Permission for accessing location when in use.
   */
  LocationWhenInUse: {
    pod: "LocationWhenInUse",
    usageKey: "NSLocationWhenInUseUsageDescription",
    purposeKey: undefined,
  },
  /**
   * Permission for accessing the media library.
   */
  MediaLibrary: {
    pod: "MediaLibrary",
    usageKey: undefined,
    purposeKey: undefined,
  },
  /**
   * Permission for accessing the microphone.
   */
  Microphone: {
    pod: "Microphone",
    usageKey: "NSMicrophoneUsageDescription",
    purposeKey: undefined,
  },
  /**
   * Permission for accessing motion activity.
   */
  Motion: {
    pod: "Motion",
    usageKey: "NSMotionUsageDescription",
    purposeKey: undefined,
  },
  /**
   * Permission for receiving notifications.
   */
  Notifications: {
    pod: "Notifications",
    usageKey: undefined,
    purposeKey: undefined,
  },
  /**
   * Permission for accessing the photo library.
   */
  PhotoLibrary: {
    pod: "PhotoLibrary",
    usageKey: "NSPhotoLibraryUsageDescription",
    purposeKey: undefined,
  },
  /**
   * Permission for adding photos to the photo library.
   */
  PhotoLibraryAdd: {
    pod: "PhotoLibraryAddOnly",
    usageKey: "NSPhotoLibraryAddUsageDescription",
    purposeKey: undefined,
  },
  /**
   * Permission for accessing reminders.
   */
  Reminders: {
    pod: "Reminders",
    usageKey: "NSRemindersFullAccessUsageDescription",
    purposeKey: undefined,
  },
  /**
   * Permission for accessing Siri.
   */
  Siri: {
    pod: "Siri",
    usageKey: "NSSiriUsageDescription",
    purposeKey: undefined,
  },
  /**
   * Permission for speech recognition.
   */
  SpeechRecognition: {
    pod: "SpeechRecognition",
    usageKey: "NSSpeechRecognitionUsageDescription",
    purposeKey: undefined,
  },
};

/**
 * Represents a set of Android permissions.
 */
export const android = [
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
