import { AppConfigType } from '../types';
import { AppRegistry } from 'react-native';
import FSNetwork from '@brandingbrand/fsnetwork';
import configureStore from '../store/configureStore';

export abstract class FSAppBase {
  appConfig: AppConfigType;
  api: FSNetwork;
  store: any;

  constructor(appConfig: AppConfigType) {
    this.appConfig = appConfig;
    this.api = new FSNetwork(appConfig.remote || {});
    this.store = configureStore(appConfig.initialState, appConfig.reducers);
    this.registerScreens();
  }

  getApp(): any {
    // @ts-ignore: Is set in react-native-web
    if (AppRegistry.getApplication) {
      // @ts-ignore: Is set in react-native-web
      return AppRegistry.getApplication('Flagship', {
        initialProps: {
          appConfig: this.appConfig,
          api: this.api,
          store: this.store
        }
      });
    }
    return undefined;
  }

  abstract registerScreens(): void;
  abstract shouldShowDevMenu(): boolean;
  abstract startApp(): void;
}
