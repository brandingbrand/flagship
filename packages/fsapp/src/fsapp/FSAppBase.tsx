import React from 'react';
import { AppConfigType } from '../types';
import FSNetwork from '@brandingbrand/fsnetwork';
import configureStore from '../store/configureStore';
import { Store } from 'redux';
import type { Request } from 'express';

export interface WebApplication {
  element: JSX.Element;
  getStyleElement: (props?: Partial<React.StyleHTMLAttributes<HTMLStyleElement>>) => JSX.Element;
}

export abstract class FSAppBase {
  appConfig: AppConfigType;
  api: FSNetwork;
  store?: Store;

  constructor(appConfig: AppConfigType) {
    this.appConfig = appConfig;
    this.api = new FSNetwork(appConfig.remote || {});
  }

  updatedInitialState = async (excludeUncached?: boolean, req?: Request) => {
    let updatedState = this.appConfig.initialState || {};
    if (this.appConfig.cachedData) {
      updatedState = (await this.appConfig.cachedData({
        initialState: updatedState,
        variables: {}
      }, req)).initialState;
    }
    if (this.appConfig.uncachedData && excludeUncached !== false) {
      updatedState = (await this.appConfig.uncachedData({
        initialState: updatedState,
        variables: {}
      }, req)).initialState;
    }
    return updatedState;
  }

  initApp = async () => {
    if (!this.appConfig.serverSide) {
      this.store = await this.getReduxStore(await this.updatedInitialState());
    }
    this.registerScreens();
  }

  getReduxStore = async (initialState?: any) => {
    return configureStore(
      initialState || this.appConfig.initialState,
      this.appConfig.reducers
    );
  }

  abstract getApp(appConfig?: AppConfigType, store?: Store): WebApplication | undefined;
  abstract registerScreens(): void;
  abstract shouldShowDevMenu(): boolean;
  abstract startApp(): Promise<void>;
}
