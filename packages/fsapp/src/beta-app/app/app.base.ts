import type { Action, Store } from 'redux';
import type { AppConfig, AppConstructor, IApp } from './types';

import FSNetwork from '@brandingbrand/fsnetwork';
import { boundMethod } from 'autobind-decorator';

import { FSRouter, Routes } from '../router';
import { GenericState, StoreManager } from '../store';
import { makeScreenWrapper } from './screen.wrapper';
import { getVersion } from './utils';

export abstract class FSAppBase implements IApp {
  public static async bootstrap<S extends GenericState, A extends Action, T extends FSAppBase>(
    this: AppConstructor<T>,
    config: AppConfig<S, A>
  ): Promise<T> {
    const version = await getVersion(config);
    const api = config.remote ? new FSNetwork(config.remote) : undefined;
    const storeManager = config.state ? new StoreManager(config.state) : undefined;
    const store = !config.serverSide
      ? await storeManager?.getReduxStore(await storeManager.updatedInitialState())
      : undefined;

    let app: T | undefined;
    const router = await FSRouter.register({
      api,
      shell: config.webShell,
      analytics: config.analytics,
      screenWrap: makeScreenWrapper({
        store,
        app: () => app
      }),
      ...config.router
    });

    app = new this(
      version,
      config,
      router,
      store as S extends GenericState ? (A extends Action ? Store<S, A> : undefined) : undefined
    );
    if (!config.serverSide) {
      await app.startApplication();
    }
    return app;
  }

  public readonly routes: Routes = this.router.routes;

  constructor(
    public readonly version: string,
    public readonly config: AppConfig,
    protected readonly router: FSRouter,
    public readonly store?: Store
  ) {}

  @boundMethod
  public async openUrl(url: string): Promise<void> {
    await this.router.open(url);
  }

  abstract startApplication(): Promise<void>;
  abstract stopApplication(): Promise<void>;
}
