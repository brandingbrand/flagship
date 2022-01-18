export interface PlatformSpecific<T> {
  android: T;
  ios: T;
}

export const android = <T>(
  platformSpecificString: T | { android: PlatformSpecific<T>['android'] }
): PlatformSpecific<T>['android'] => {
  if (typeof platformSpecificString === 'object' && 'android' in platformSpecificString) {
    return platformSpecificString.android;
  }

  if (typeof platformSpecificString === 'object' && 'ios' in platformSpecificString) {
    return undefined as unknown as T;
  }

  return platformSpecificString;
};

export const ios = <T>(
  platformSpecificString: T | { ios: PlatformSpecific<T>['ios'] }
): PlatformSpecific<T>['ios'] => {
  if (typeof platformSpecificString === 'object' && 'ios' in platformSpecificString) {
    return platformSpecificString.ios;
  }

  if (typeof platformSpecificString === 'object' && 'android' in platformSpecificString) {
    return undefined as unknown as T;
  }

  return platformSpecificString;
};
