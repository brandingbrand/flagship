import {check, Permission, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import { Platform } from 'react-native';

function getPermissionToCheck(): Permission {
  return Platform.OS === 'ios' ?
    PERMISSIONS.IOS.LOCATION_WHEN_IN_USE : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
}

export async function isGeolocationAllowed(): Promise<boolean> {
  return check(getPermissionToCheck())
    .then(status => status === RESULTS.GRANTED)
    .catch(error => {
      if (__DEV__) {
        console.log(
          `%cLocator\n%c Function: isGeolocationAllowed\n Error: `,
          'color: blue',
          'color: grey',
          error
        );
      }

      throw error;
    });
}

export async function requestGeolocationPermission(): Promise<boolean> {
  return request(getPermissionToCheck())
    .then(status => status === RESULTS.GRANTED);
}
