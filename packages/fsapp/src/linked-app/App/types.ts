import type { FSNetworkRequestConfig } from '@brandingbrand/fsnetwork';
import type { RouterConfig } from '../AppRouter';
import type { GenericState, StoreConfig } from '../Store';

export interface AppConfig<S extends GenericState> {
  router: Omit<RouterConfig, 'screenWrap'>;
  remote: FSNetworkRequestConfig;
  state: StoreConfig<S>;
}

export interface App {
  openUrl(url: string) : void;
}

export interface AppConstructor<S = {}> {
  bootstrap(options: AppConfig<S>): Promise<App>;
}
