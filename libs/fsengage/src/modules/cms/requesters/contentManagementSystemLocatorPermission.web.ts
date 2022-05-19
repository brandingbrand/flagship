export const isGeolocationAllowed = async (): Promise<boolean> =>
  // In web there is not a way to know the permission without notifiying the user.
  false;

export const requestGeolocationPermission = async (): Promise<boolean> =>
  // In web we need to request location to trigger the permission prompt to the user.
  new Promise<boolean>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (position) {
          resolve(true);
          return;
        }

        resolve(false);
      },
      (error) => {
        if (__DEV__) {
          console.log(
            `%cLocator\n%c Function: requestGeolocationPermission\n Error:`,
            'color: blue',
            'color: grey',
            error
          );
        }

        reject(error);
      }
    );
  });
