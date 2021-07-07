import type { FSRouterHistory } from './history';
import type {
  FSRouter,
  FSRouterConstructor,
  InternalRouterConfig,
  RouterConfig,
  Routes
} from './types';

import { Linking } from 'react-native';

import { getPath, resolveRoutes } from './utils';

export abstract class FSRouterBase implements FSRouter {
  public static async register<T extends FSRouterBase>(
    this: FSRouterConstructor<T>,
    options: RouterConfig & InternalRouterConfig
  ): Promise<T> {
    const mergedRoutes = await resolveRoutes(options);
    return new this(mergedRoutes, options);
  }

  constructor(public readonly routes: Routes, protected readonly history: FSRouterHistory) {}

  public async open(url: string): Promise<void> {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      const path = getPath(url);
      return this.history.open(path.startsWith('/') ? path : `/${path}`);
    }
  }
}
