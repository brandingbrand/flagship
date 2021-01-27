import type { FSNetworkRequestConfig } from '@brandingbrand/fsnetwork';
import type { AppRouter, RouterConfig } from '../AppRouter';
import type { GenericState, StoreConfig } from '../Store';

export interface AppConfig<S extends GenericState = GenericState> {
  readonly version?: string;
  readonly router: RouterConfig;
  readonly remote?: FSNetworkRequestConfig;
  readonly state?: StoreConfig<S>;
}

export interface App {
  readonly version: string;
  openUrl(url: string): void;
}

export interface WebApplication {
  readonly element: JSX.Element;
  getStyleElement: (props?: Partial<React.StyleHTMLAttributes<HTMLStyleElement>>) => JSX.Element;
}

export interface AppConstructor<T extends App = App, S extends GenericState = GenericState> {
  new (version: string, appRouter: AppRouter): T;
  bootstrap(options: AppConfig<S>): Promise<T>;

  shouldShowDevMenu(): boolean;
  getApp(): WebApplication | undefined;
  getVersion(config: AppConfig<S>): Promise<string>;
}
