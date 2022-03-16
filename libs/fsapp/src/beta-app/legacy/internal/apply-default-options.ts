import { Navigation, Options } from 'react-native-navigation';

/**
 * @internal
 * @deprecated
 */
export const applyDefaultOptions = (defaultOptions?: Options) => {
  if (defaultOptions) {
    Navigation.events().registerAppLaunchedListener(async () => {
      Navigation.setDefaultOptions(defaultOptions);
    });
  }
};
