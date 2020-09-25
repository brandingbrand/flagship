import { Platform } from 'react-native';

// Geolocation is currently bundled with fsengage even though apps may not use location-based
// targeting. Because react-native-permissions requires apps to expose the permissions they use,
// this makes permissions a "soft" dependency that apps can opt into by including rn-permissions
// as a dependency. TODO - refactor fsengage so that location-based permissions are taken out of
// engage core.
let rnPermissions: any = null;

try {
  rnPermissions = require('react-native-permissions');
} catch (e) {
  console.warn(
    'react-native-permissions must be added to your project'
    + ' to enable granular geolocation in fsengage'
  );
}

function getPermissionToCheck(): any {
  if (!rnPermissions) {
    return null;
  }

  return Platform.OS === 'ios' ?
    rnPermissions.PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
      : rnPermissions.PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
}

export async function isGeolocationAllowed(): Promise<boolean> {
  const permissionToCheck = getPermissionToCheck();

  if (permissionToCheck) {
    return rnPermissions.check(permissionToCheck)
      .then((status: any) => status === rnPermissions.RESULTS.GRANTED)
      .catch((error: Error) => {
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

  return Promise.resolve(false);
}

export async function requestGeolocationPermission(): Promise<boolean> {
  const permissionToCheck = getPermissionToCheck();

  if (permissionToCheck) {
    return rnPermissions.request(permissionToCheck)
      .then((status: any) => status === rnPermissions.RESULTS.GRANTED);
  }

  return Promise.resolve(false);
}
