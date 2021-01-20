import type { AppConfig, AppConstructor } from './types';
import type { WebApplication } from '../../fsapp/FSAppBase';

import FSNetwork from '@brandingbrand/fsnetwork';
import { AppRegistry } from 'react-native';

import { AppRouter } from '../AppRouter';
import { GenericState, StoreManager } from '../Store';
import { StaticImplements } from '../utils';
import { AppBase } from './AppBase';
import { makeScreenWrapper } from './screen-wrapper';

@StaticImplements<AppConstructor>()
export class App<S extends GenericState = {}> extends AppBase<S> {
  public static async bootstrap<S extends GenericState>({
    router,
    remote,
    state
  }: AppConfig<S>): Promise<App> {
    const api = new FSNetwork(remote);
    const storeManager = new StoreManager(state);
    const store = await storeManager.getReduxStore(await storeManager.updatedInitialState());

    return AppRouter.register({
      screenWrap: makeScreenWrapper({ api, store }),
      ...router
    }).then(appRouter => new App<S>(appRouter, api));
  }

  private constructor(router: AppRouter, api: FSNetwork) {
    super(router, api);
  }

  public getApp(): WebApplication | undefined {
    if ('getApplication' in AppRegistry) {
      // @ts-ignore: Is set in react-native-web
      return AppRegistry.getApplication('Flagship', {});
    }

    return undefined;
  }

  public shouldShowDevMenu(): boolean {
    return __DEV__;
  }
}
