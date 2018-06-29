import Permissions from 'react-native-permissions';

const kLocationPermissionStatuses: any = {
  Authorized: 'authorized',
  Denied: 'denied',
  Restricted: 'restricted',
  Undetermined: 'undetermined'
};

export async function isGeolocationAllowed(): Promise<boolean> {
  return Permissions.check('location')
    .then(status => status === kLocationPermissionStatuses.Authorized)
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
  return Permissions.request('location')
    .then(status => status === kLocationPermissionStatuses.Authorized);
}
