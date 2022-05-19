import type React from 'react';

import FSNetwork from '@brandingbrand/fsnetwork';

import type { Request } from 'express';
import type { Store } from 'redux';

import AppRouter from '../lib/app-router';
import configureStore from '../store/configureStore';
import type { AppConfigType } from '../types';

export interface WebApplication {
  element: JSX.Element;
  getStyleElement: (props?: Partial<React.StyleHTMLAttributes<HTMLStyleElement>>) => JSX.Element;
}

export abstract class FSAppBase {
  constructor(appConfig: AppConfigType) {
    this.appConfig = appConfig;
    this.api = new FSNetwork(appConfig.remote || {});
    this.appRouter = new AppRouter(appConfig);
  }

  public readonly appConfig: AppConfigType;
  public readonly api: FSNetwork;
  public store?: Store;
  public readonly appRouter: AppRouter;

  public readonly updatedInitialState = async (excludeUncached?: boolean, req?: Request) => {
    let updatedState = this.appConfig.initialState || {};
    if (this.appConfig.cachedData) {
      updatedState = (
        await this.appConfig.cachedData(
          {
            initialState: updatedState,
            variables: {},
          },
          req
        )
      ).initialState;
    }
    if (this.appConfig.uncachedData && excludeUncached !== false) {
      updatedState = (
        await this.appConfig.uncachedData(
          {
            initialState: updatedState,
            variables: {},
          },
          req
        )
      ).initialState;
    }
    return updatedState;
  };

  public readonly initApp = async () => {
    if (!this.appConfig.serverSide) {
      this.store = await this.getReduxStore(await this.updatedInitialState());
    }
    if (this.appConfig.routerConfig) {
      await this.appRouter.loadRoutes();
    }
    this.registerScreens();
  };

  public readonly getReduxStore = async (initialState?: unknown) =>
    configureStore(
      initialState || this.appConfig.initialState,
      this.appConfig.reducers,
      this.appConfig.storeMiddleware || []
    );

  public abstract getApp(appConfig?: AppConfigType, store?: Store): WebApplication | undefined;
  public abstract registerScreens(): void;
  public abstract shouldShowDevMenu(): boolean;
  public abstract startApp(): Promise<void>;
}
