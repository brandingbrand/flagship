import camelCase from "lodash/camelCase";
import startCase from "lodash/startCase";

import type { IOSPermissionType } from "../types";

export const permissions = {
  APP_TRACKING_TRANSPARENCY: "NSUserTrackingUsageDescription",
  BLUETOOTH_PERIPHERAL: "NSBluetoothPeripheralUsageDescription",
  CALENDARS: "NSCalendarsUsageDescription",
  CAMERA: "NSCameraUsageDescription",
  CONTACTS: "NSContactsUsageDescription",
  FACE_ID: "NSFaceIDUsageDescription",
  LOCATION_ACCURACY: "",
  LOCATION_ALWAYS: [
    "NSLocationAlwaysUsageDescription",
    "NSLocationWhenInUseUsageDescription",
    "NSLocationAlwaysAndWhenInUseUsageDescription",
  ],
  LOCATION_WHEN_IN_USE: "NSLocationWhenInUseUsageDescription",
  MEDIA_LIBRARY: "NSAppleMusicUsageDescription",
  MICROPHONE: "NSMicrophoneUsageDescription",
  MOTION: "NSMotionUsageDescription",
  NOTIFICATIONS: "",
  PHOTO_LIBRARY: "NSPhotoLibraryUsageDescription",
  PHOTO_LIBRARY_ADD_ONLY: "NSPhotoLibraryAddUsageDescription",
  REMINDERS: "NSRemindersUsageDescription",
  SIRI: "NSSiriUsageDescription",
  SPEECH_RECOGNITION: "NSSpeechRecognitionUsageDescription",
  STORE_KIT: "",
};

export const usageDescriptions = (requiredPermissions: IOSPermissionType[]) =>
  requiredPermissions
    .filter((it) => !!it.text)
    .map((it) => {
      const usageDescription = permissions[it.permission];

      if (typeof usageDescription === "string") {
        return `    <key>${permissions[it.permission]}</key>
    <string>${it.text}</string>`;
      } else if (typeof usageDescription === "object") {
        return usageDescription
          .map((ir) => {
            return `    <key>${ir}</key>
    <string>${it.text}</string>`;
          })
          .join("\n");
      }
    })
    .filter((it) => !!it)
    .join("\n");

const pod = (value: string) => {
  if (value === "FACE_ID") {
    return "FaceID";
  } else {
    return startCase(camelCase(value)).replace(/ /g, "");
  }
};

export const pods = (requiredPermissions: IOSPermissionType[]) =>
  requiredPermissions
    ?.map((it) => {
      return `  pod 'Permission-${pod(
        it.permission
      )}', :path => "../node_modules/react-native-permissions/ios/${pod(
        it.permission
      )}"`;
    })
    .join("\n");
