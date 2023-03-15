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
    .reduce((acc, curr) => {
      const usageDescription = permissions[curr.permission];

      if (typeof usageDescription === "string") {
        return {
          ...acc,
          [usageDescription]: curr.text,
        };
      }

      if (typeof usageDescription === "object") {
        const obj = usageDescription.reduce((acc$, curr$) => {
          return {
            ...acc$,
            [curr$]: curr.text,
          };
        }, {});

        return {
          ...acc,
          ...obj,
        };
      }

      return acc;
    }, {});

const pod = (value: string) => {
  if (value === "FACE_ID") {
    return "FaceID";
  } else {
    return startCase(camelCase(value)).replace(/ /g, "");
  }
};

export const podspec = (requiredPermissions: IOSPermissionType[]) =>
  requiredPermissions
    .reduce(
      (acc, curr) => {
        return [...acc, `"ios/${pod(curr.permission)}/*.{h,m,mm}"`];
      },
      ['"ios/*.{h,m,mm}"']
    )
    .join(", ");
