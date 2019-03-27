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
    if (!appConfig.serverSide) {
      this.store = configureStore(appConfig.initialState, appConfig.reducers);
    }
    this.registerScreens();
  }

  getApp(appConfig?: AppConfigType): any {
    // @ts-ignore: Is set in react-native-web
    if (AppRegistry.getApplication) {
      const config = appConfig || this.appConfig;
      // @ts-ignore: Is set in react-native-web
      return AppRegistry.getApplication('Flagship', {
        initialProps: {
          appConfig: config,
          api: this.api,
          store: this.store || configureStore(config.initialState, config.reducers)
        }
      });
    }
    return undefined;
  }

  abstract registerScreens(): void;
  abstract shouldShowDevMenu(): boolean;
  abstract startApp(): void;
}
