import type { AppConfig, AppConstructor } from './types';

import FSNetwork from '@brandingbrand/fsnetwork';

import { AppRouter } from '../AppRouter';
import { GenericState, StoreManager } from '../Store';
import { makeScreenWrapper } from './screen-wrapper';

export abstract class AppBase {
  public static async bootstrap<S extends GenericState, T extends AppBase>(
    this: AppConstructor<T, S>,
    config: AppConfig<S>
  ): Promise<AppBase> {
    const api = new FSNetwork(config.remote);
    const storeManager = new StoreManager(config.state);

    const version = await this.getVersion(config);
    const store = await storeManager.getReduxStore(await storeManager.updatedInitialState());

    const router = await AppRouter.register({
      screenWrap: makeScreenWrapper({ api, store }),
      ...config.router
    });

    return new this(version, router, api);
  }

  constructor(
    public readonly version: string | undefined,
    protected readonly router: AppRouter,
    protected readonly api: FSNetwork
  ) {}

  public async openUrl(url: string): Promise<void> {
    await this.router.open(url);
  }
}
