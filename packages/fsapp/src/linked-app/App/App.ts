import type { AppConfig, AppConstructor } from './types';
import type { WebApplication } from '../../fsapp/FSAppBase';

import { Linking, NativeModules } from 'react-native';
import FSNetwork from '@brandingbrand/fsnetwork';

import { CodePushVersion } from '../../fsapp/FSApp';
import NativeConstants from '../../lib/native-constants';

import { AppRouter } from '../AppRouter';
import { GenericState, StoreManager } from '../Store';
import { StaticImplements } from '../utils';
import { AppBase } from './AppBase';
import { makeScreenWrapper } from './screen-wrapper';

const { CodePush } = NativeModules;

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
    }).then(router => new App<S>(router, api));
  }

  public version: string | undefined;

  private constructor(router: AppRouter, api: FSNetwork) {
    super(router, api);
    if (CodePush) {
      CodePush.getUpdateMetadata(CodePush.codePushUpdateStateRunning).then(
        (version: CodePushVersion) => {
          if (version) {
            this.version = version.label;
          }
        }
      );
    }

    Linking.addEventListener('url', ({ url }) => this.openUrl(url));
    Linking.getInitialURL()
      .then(async url => {
        if (url) {
          await this.openUrl(url);
        }
      })
      .catch();
  }

  public getApp(): WebApplication | undefined {
    return;
  }

  public shouldShowDevMenu(): boolean {
    return NativeConstants && NativeConstants.ShowDevMenu && NativeConstants.ShowDevMenu === 'true';
  }
}
