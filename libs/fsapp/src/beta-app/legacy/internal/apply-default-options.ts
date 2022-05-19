import type { Options } from 'react-native-navigation';
import { Navigation } from 'react-native-navigation';

/**
 * @internal
 * @param defaultOptions
 * @deprecated
 */
export const applyDefaultOptions = (defaultOptions?: Options) => {
  if (defaultOptions) {
    Navigation.events().registerAppLaunchedListener(async () => {
      Navigation.setDefaultOptions(defaultOptions);
    });
  }
};
