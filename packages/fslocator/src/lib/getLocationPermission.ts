import { Alert } from 'react-native';

// @ts-ignore TODO: Add typing support for react-native-open-settings
import OpenSettings from 'react-native-open-settings';
import Permissions from 'react-native-permissions';

export default async function getLocationPermission(): Promise<boolean> {
  const permStatus = await Permissions.check('location');
  if (permStatus === 'undetermined') {
    const requestedPerm = await Permissions.request('location');
    return requestedPerm === 'authorized';
  } else if (permStatus === 'denied') {
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
