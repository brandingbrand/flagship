import React from 'react';
import { AppConfigType } from '../types';
import FSNetwork from '@brandingbrand/fsnetwork';
import configureStore from '../store/configureStore';
import { Store } from 'redux';
import type { Request } from 'express';
import AppRouter from '../lib/app-router';

export interface WebApplication {
  element: JSX.Element;
  getStyleElement: (props?: Partial<React.StyleHTMLAttributes<HTMLStyleElement>>) => JSX.Element;
}

export abstract class FSAppBase {
  appConfig: AppConfigType;
  api: FSNetwork;
  store?: Store;
  appRouter: AppRouter;

  constructor(appConfig: AppConfigType) {
    this.appConfig = appConfig;
    this.api = new FSNetwork(appConfig.remote || {});
    this.appRouter = new AppRouter(appConfig);
  }

  updatedInitialState = async (excludeUncached?: boolean, req?: Request) => {
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

  initApp = async () => {
    if (!this.appConfig.serverSide) {
      this.store = await this.getReduxStore(await this.updatedInitialState());
    }
    if (this.appConfig.routerConfig) {
      await this.appRouter.loadRoutes();
    }
    this.registerScreens();
  };

  getReduxStore = async (initialState?: any) => {
    return configureStore(
      initialState || this.appConfig.initialState,
      this.appConfig.reducers,
      this.appConfig.storeMiddleware || []
    );
  };

  abstract getApp(appConfig?: AppConfigType, store?: Store): WebApplication | undefined;
  abstract registerScreens(): void;
  abstract shouldShowDevMenu(): boolean;
  abstract startApp(): Promise<void>;
}
