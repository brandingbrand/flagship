import FSNetwork, { FSNetworkRequestConfig } from '@brandingbrand/fsnetwork';
import type { AppRouter, RouterConfig } from '../AppRouter';
import type { GenericState, StoreConfig } from '../Store';

export interface AppConfig<S extends GenericState = GenericState> {
  version?: string;
  router: RouterConfig;
  remote: FSNetworkRequestConfig;
  state: StoreConfig<S>;
}

export interface App {
  openUrl(url: string): void;
}

export interface WebApplication {
  element: JSX.Element;
  getStyleElement: (props?: Partial<React.StyleHTMLAttributes<HTMLStyleElement>>) => JSX.Element;
}

export interface AppConstructor<T extends App = App, S extends GenericState = GenericState> {
  new (version: string | undefined, appRouter: AppRouter, api: FSNetwork): T;
  bootstrap(options: AppConfig<S>): Promise<T>;

  shouldShowDevMenu(): boolean;
  getApp(): WebApplication | undefined;
  getVersion(config: AppConfig<S>): Promise<string>;
}
