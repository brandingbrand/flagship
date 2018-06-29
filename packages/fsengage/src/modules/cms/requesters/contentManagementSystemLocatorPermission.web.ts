export async function isGeolocationAllowed(): Promise<boolean> {
  // In web there is not a way to know the permission without notifiying the user.
  return Promise.resolve(false);
}

export async function requestGeolocationPermission(): Promise<boolean> {
  // In web we need to request location to trigger the permission prompt to the user.
  return new Promise<boolean>((resolve, reject) => {
    return navigator.geolocation.getCurrentPosition(position => {
      if (position) {
        return resolve(true);
      }

      return resolve(false);
    }, error => {
      if (__DEV__) {
        console.log(
          `%cLocator\n%c Function: requestGeolocationPermission\n Error: `,
          'color: blue',
          'color: grey',
          error
        );
      }

      return reject(error);
    });
  });
}
