import type { App, AppConfig, AppConstructor } from './types';

import FSNetwork from '@brandingbrand/fsnetwork';
import { boundMethod } from 'autobind-decorator';

import { AppRouter } from '../AppRouter';
import { GenericState, StoreManager } from '../Store';
import { makeScreenWrapper } from './screen.wrapper';

export abstract class AppBase implements App {
  public static async bootstrap<S extends GenericState, T extends AppBase>(
    this: AppConstructor<T, S>,
    config: AppConfig<S>
  ): Promise<T> {
    const api = config.remote ? new FSNetwork(config.remote) : undefined;
    const storeManager = config.state ? new StoreManager(config.state) : undefined;

    const version = await this.getVersion(config);
    const store = await storeManager?.getReduxStore(await storeManager.updatedInitialState());

    let app: T | undefined;
    const router = await AppRouter.register({
      api,
      screenWrap: makeScreenWrapper({
        api,
        store,
        app: () => app
      }),
      ...config.router
    });

    app = new this(version, router);
    return app;
  }

  constructor(
    public readonly version: string,
    protected readonly router: AppRouter
  ) {}

  @boundMethod
  public async openUrl(url: string): Promise<void> {
    await this.router.open(url);
  }
}
