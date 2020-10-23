import { Alert, Platform } from 'react-native';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';

// @ts-ignore TODO: Add typing support for react-native-open-settings
import OpenSettings from 'react-native-open-settings';

export default async function getLocationPermission(): Promise<boolean> {
  const permissionToCheck = Platform.OS === 'ios' ?
    PERMISSIONS.IOS.LOCATION_WHEN_IN_USE : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

  const permStatus = await check(permissionToCheck);

  if (permStatus === RESULTS.DENIED) {
    // DENIED means that the user doesn't have the permission enabled but is requestable
    const requestedPerm = await request(permissionToCheck);

    return requestedPerm === RESULTS.GRANTED;
  } else if (permStatus === RESULTS.BLOCKED) {
    // BLOCKED means that we cannot request for the permission; the user has to enable it manually
    Alert.alert(
      'Turn on Location Services To Allow Us to Determine Your Location',
      '',
      [
        { text: 'Settings', onPress: () => OpenSettings.openSettings() },
        { text: 'Cancel' }
      ],
      { cancelable: false }
    );
    return false;
  } else {
    return true;
  }
}
