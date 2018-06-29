import { AsyncStorage, PushNotificationIOS } from 'react-native';

import RNPN, {
  PushNotificationOptions,
  PushNotificationPermissions
} from 'react-native-push-notification';
import ReactNativeDeviceInfo from 'react-native-device-info';

// TODO: Fix RNPN's types.
// The current version fails to include the permissions key as an available option
type RNPNOptions = PushNotificationOptions & { permissions: PushNotificationPermissions };

export const HAS_ENABLED_PUSH_KEY = 'HAS_ENABLED_PUSH';
export const HAS_SEEN_PUSH_PROMPT_KEY = 'HAS_SEEN_PUSH_PROMPT';

export interface TokenData {
  token: string;
  os: string;
}

const PushNotifications = {
  init: (
    onRegisterFn?: (tokenData?: TokenData) => void,
    onNotificationFn?: (notification: any) => void
  ) => {
    if (ReactNativeDeviceInfo.isEmulator()) {
      alert('Push notifications cannot be tested in a simulator. Please use a physical device.');

      return;
    }

    AsyncStorage.setItem(HAS_SEEN_PUSH_PROMPT_KEY, 'true')
      .then(() => {
        const options: RNPNOptions = {
          onRegister: (tokenData?: TokenData) => {
            AsyncStorage.setItem(HAS_ENABLED_PUSH_KEY, 'true')
              .then(() => {
                if (onRegisterFn) {
                  onRegisterFn(tokenData);
                }
              })
              .catch(err => {
                console.warn('Unable to set HAS_ENABLED_PUSH in AsyncStorage', err);

                if (onRegisterFn) {
                  onRegisterFn(tokenData);
                }
              });
          },

          onNotification: notification => {
            if (onNotificationFn) {
              onNotificationFn(notification);
            }

            notification.finish(PushNotificationIOS.FetchResult.NoData);
          },

          // Android only
          senderID: 'TO_DO',

          // iOS Only
          permissions: {
            alert: true,
            badge: true,
            sound: true
          },

          // Pop the initial notification automatically
          popInitialNotification: true,

          // Request permissions immediately
          requestPermissions: true
        };

        RNPN.configure(options);
      })
      .catch(err => {
        console.warn('Unable to set HAS_SEEN_PUSH_PROMPT in AsyncStorage', err);

        if (onRegisterFn) {
          onRegisterFn();
        }
      });
  },

  hasSeenPushPrompt: async (): Promise<boolean> => {
    const hasSeenPushPrompt = await AsyncStorage.getItem(HAS_SEEN_PUSH_PROMPT_KEY);

    return !!hasSeenPushPrompt;
  },

  pushIsEnabled: async (): Promise<boolean> => {
    // Check if user enabled notifications through this library
    const isEnabledStorage = await AsyncStorage.getItem(HAS_ENABLED_PUSH_KEY);

    // Check if user enabled push notifications via this app (similar functionality
    // doesn't currently exist for Android)
    const isEnabledIOS = await PushNotifications.checkPermissionsIOS();

    return !!isEnabledStorage || !!(isEnabledIOS && isEnabledIOS.alert);
  },

  checkPermissionsIOS: async (): Promise<PushNotificationPermissions> => {
    return new Promise<PushNotificationPermissions>((resolve, reject) => {
      RNPN.checkPermissions((permissions: PushNotificationPermissions) => {
        return resolve(permissions);
      });
    });
  }
};

export default PushNotifications;
