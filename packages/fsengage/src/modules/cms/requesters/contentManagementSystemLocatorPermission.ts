import { Platform } from 'react-native';
import type { default as RNPermissions, Permission } from 'react-native-permissions';

// Geolocation is currently bundled with fsengage even though apps may not use location-based
// targeting. Because react-native-permissions requires apps to expose the permissions they use,
// this makes permissions a "soft" dependency that apps can opt into by including rn-permissions
// as a dependency. TODO - refactor fsengage so that location-based permissions are taken out of
// engage core.
let rnPermissions: typeof RNPermissions | null = null;

try {
  rnPermissions = require('react-native-permissions');
} catch (e) {
  console.warn(
    'react-native-permissions must be added to your project'
    + ' to enable granular geolocation in fsengage'
  );
}

function getPermissionToCheck(rnPermissions: typeof RNPermissions): Permission {
  return Platform.OS === 'ios' ?
    rnPermissions.PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
      : rnPermissions.PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
}

export async function isGeolocationAllowed(): Promise<boolean> {
  const permissions = rnPermissions;

  if (permissions) {
    const permissionToCheck = getPermissionToCheck(permissions);

    return permissions.check(permissionToCheck)
      .then(status => status === permissions.RESULTS.GRANTED)
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
  const permissions = rnPermissions;

  if (permissions) {
    const permissionToCheck = getPermissionToCheck(permissions);

    return permissions.request(permissionToCheck)
      .then(status => status === permissions.RESULTS.GRANTED);
  }

  return Promise.resolve(false);
}
