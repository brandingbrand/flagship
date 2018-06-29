import { AppConfigType } from '../types';
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

  abstract registerScreens(): void;
  abstract shouldShowDevMenu(): boolean;
  abstract startApp(): void;
}
