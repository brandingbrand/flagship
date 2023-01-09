import type { FC } from 'react';

import type { RNSensitiveInfoOptions } from 'react-native-sensitive-info';

import type { IStore as CargoHoldStore } from '@brandingbrand/cargo-hold';
import type { EngagementUtilities } from '@brandingbrand/engagement-utils';
import type { Analytics } from '@brandingbrand/fsengage';
import type { FSNetworkRequestConfig } from '@brandingbrand/fsnetwork';
import type FSNetwork from '@brandingbrand/fsnetwork';

import type { Action, AnyAction, Store } from 'redux';
import type { Observable, Subscription } from 'rxjs';

import type { GenericState, StoreConfig } from '../legacy/store';
import type { FSRouter, RouterConfig, Routes } from '../router';
import type { ShellConfig } from '../shell.web';
import type { GlobalStateConfig } from '../store';

export type AttributeValue = boolean | number | string;

export interface WebApplication {
  readonly element: JSX.Element;
  getStyleElement: (props?: Partial<React.StyleHTMLAttributes<HTMLStyleElement>>) => JSX.Element;
}

export interface AppConfig<
  S extends GenericState | undefined = GenericState,
  A extends Action | undefined = AnyAction,
  C = any
> {
  readonly version: string;
  readonly root?: Element | string;
  /**
   * Only affects Web.
   *
   * If the client should hydrate server-rendered HTML.
   */
  readonly hydrate?: boolean;
  readonly analytics?: Analytics;
  readonly router: RouterConfig;
  readonly webShell?: ShellConfig;
  readonly remote?: FSNetworkRequestConfig;
  readonly engagement?: EngagementUtilities;

  /**
   * @deprecated Use cargoHold instead
   */
  readonly state?: S extends GenericState
    ? A extends Action
      ? StoreConfig<S, A>
      : undefined
    : undefined;

  readonly cargoHold?: GlobalStateConfig<C>;

  readonly sInfoOptions?: RNSensitiveInfoOptions;
  readonly getInitialURL?: () => Promise<string | null>;
  readonly onDestroy?: () => void;
  readonly provider?: FC;
}

export interface IApp {
  readonly version: string;
  readonly config: AppConfig;
  readonly routes: Routes;
  readonly store?: Store;
  readonly cargoHold?: CargoHoldStore;
  readonly engagement?: EngagementUtilities;
  openUrl: (url: string) => void;
  startApplication: () => Promise<void>;
  stopApplication: () => void;
  addStableDependency: (id: string, isStable$: Observable<boolean>) => void;
  getInitialState: <T>(id: string) => T | undefined;
  setInitialState: (id: string, value: unknown) => void;
  addInitialState: (id: string, initialData$: Observable<unknown>) => void;
  shouldRunServerEffect: (id: string, dependencies: unknown[]) => boolean;
  addSubscription: (subscription: Subscription) => void;
}

export interface AppConstructor<T extends IApp = IApp> {
  new (
    version: string,
    config: AppConfig,
    router: FSRouter,
    api?: FSNetwork,
    cargoHold?: CargoHoldStore,
    store?: Store,
    engagement?: EngagementUtilities
  ): T;
  bootstrap: (options: AppConfig) => Promise<T>;
}

export interface AppServerElements {
  element: JSX.Element;
  getStyleElement: (props: unknown) => React.ReactElement;
}
