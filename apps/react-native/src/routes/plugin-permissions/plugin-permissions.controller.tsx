// @ts-ignore
import openURLInBrowser from 'react-native/Libraries/Core/Devtools/openURLInBrowser';

import {Platform} from 'react-native';
import {useNavigator} from '@brandingbrand/fsapp';
import {PERMISSIONS, request} from 'react-native-permissions';

export default (
  props: PropsWithChildrenFunction<
    {},
    {
      onPressDocs: () => void;
      onPressClose: () => void;
      onPressCamera: () => void;
      onPressLocation: () => void;
    }
  >,
) => {
  const {children} = props;
  const navigator = useNavigator();

  const onPressDocs = () => {
    openURLInBrowser(
      'https://feat-flagship-12--whimsical-tartufo-49504f.netlify.app/en/packages/plugins/permissions',
    );
  };

  const onPressClose = () => {
    navigator.replace('/');
  };

  const onPressCamera = () => {
    Platform.select({
      ios: request(PERMISSIONS.IOS.CAMERA),
      android: request(PERMISSIONS.ANDROID.CAMERA),
    });
  };

  const onPressLocation = () => {
    Platform.select({
      ios: request(PERMISSIONS.IOS.LOCATION_ALWAYS),
      android: request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION),
    });
  };

  return children({
    onPressDocs,
    onPressClose,
    onPressCamera,
    onPressLocation,
  });
};
