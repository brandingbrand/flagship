// @ts-ignore
import openURLInBrowser from 'react-native/Libraries/Core/Devtools/openURLInBrowser';

import {Platform} from 'react-native';
import {env, useNavigator} from '@brandingbrand/fsapp';
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
      new URL(`${env.app.docs.path.plugins}/permissions`, env.app.docs.domain),
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
