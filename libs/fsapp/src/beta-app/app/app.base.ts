import type { Action, Store } from 'redux';
import type { AppConfig, AppConstructor, IApp } from './types';

import { FSNetwork } from '@brandingbrand/fsnetwork';
import { InjectionToken, Injector } from '@brandingbrand/fslinker';
import { boundMethod } from 'autobind-decorator';
import { ReactReduxContext } from 'react-redux';

import {
  API_CONTEXT_TOKEN,
  APIContext,
  APP_CONTEXT_TOKEN,
  AppContext,
  REDUX_CONTEXT_TOKEN,
  REDUX_STORE_TOKEN,
} from './context';
import { FSRouter, Routes } from '../router';
import { GenericState, StoreManager } from '../store';
import { makeScreenWrapper } from './screen.wrapper';
import { getVersion } from './utils';

export const APP_VERSION_TOKEN = new InjectionToken<string>('APP_VERSION_TOKEN');
export const APP_CONFIG_TOKEN = new InjectionToken<AppConfig>('APP_CONFIG_TOKEN');
export const API_TOKEN = new InjectionToken<FSNetwork>('API_TOKEN');

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

    // eslint-disable-next-line prefer-const
    let app: T | undefined;
    const router = await FSRouter.register({
      api,
      shell: config.webShell,
      analytics: config.analytics,
      screenWrap: makeScreenWrapper({
        store,
        app: () => app,
        provider: config.provider,
      }),
      ...config.router,
    });

    app = new this(
      version,
      config,
      router,
      api,
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
    public readonly api?: FSNetwork,
    public readonly store?: Store
  ) {
    Injector.provide({ provide: API_TOKEN, useValue: api });
    Injector.provide({ provide: REDUX_STORE_TOKEN, useValue: store });
    Injector.provide({ provide: APP_CONFIG_TOKEN, useValue: config });
    Injector.provide({ provide: APP_VERSION_TOKEN, useValue: version });
    Injector.provide({ provide: API_CONTEXT_TOKEN, useValue: APIContext });
    Injector.provide({ provide: APP_CONTEXT_TOKEN, useValue: AppContext });
    Injector.provide({ provide: REDUX_CONTEXT_TOKEN, useValue: ReactReduxContext });
  }

  @boundMethod
  public async openUrl(url: string): Promise<void> {
    await this.router.open(url);
  }

  abstract startApplication(): Promise<void>;
  abstract stopApplication(): Promise<void>;
}
