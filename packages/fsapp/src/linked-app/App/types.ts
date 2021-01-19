import { AppRouterOptions } from '../AppRouter';

export interface AppOptions {
  name: string;
  router: AppRouterOptions;
}

export interface App {
  openUrl(url: string) : void;
}

export interface AppConstructor {
  bootstrap(options: AppOptions): Promise<App>;
}
