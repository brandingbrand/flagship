import type { Action, AnyAction, Store } from 'redux';
import type { Analytics } from '@brandingbrand/fsengage';
import type { FSRouter, RouterConfig, Routes } from '../router';
import type { GenericState, StoreConfig } from '../store';
import type { ShellConfig } from '../shell.web';

import FSNetwork, { FSNetworkRequestConfig } from '@brandingbrand/fsnetwork';

export interface WebApplication {
  readonly element: JSX.Element;
  getStyleElement(props?: Partial<React.StyleHTMLAttributes<HTMLStyleElement>>): JSX.Element;
}

export interface AppConfig<
  S extends GenericState | undefined = GenericState,
  A extends Action | undefined = AnyAction
> {
  readonly version: string;
  readonly root?: Element | string;
  readonly serverSide?: true;
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
  readonly state?: S extends GenericState
    ? A extends Action
      ? StoreConfig<S, A>
      : undefined
    : undefined;
}

export interface IApp {
  readonly version: string;
  readonly config: AppConfig;
  readonly routes: Routes;
  readonly store?: Store;
  openUrl(url: string): void;
  startApplication(): Promise<void>;
  stopApplication(): Promise<void>;
}

export interface AppConstructor<T extends IApp = IApp> {
  new (version: string, config: AppConfig, router: FSRouter, api?: FSNetwork, store?: Store): T;
  bootstrap(options: AppConfig): Promise<T>;
}
