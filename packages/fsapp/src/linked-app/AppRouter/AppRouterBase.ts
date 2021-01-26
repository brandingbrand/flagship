import type { RouterHistory } from '../History';
import type { AppRouter, AppRouterConstructor, RouterConfig } from './types';

import { Linking } from 'react-native';

import { resolveRoutes } from './utils';

export abstract class AppRouterBase implements AppRouter {
  protected static async createInstance<T extends AppRouterBase>(
    This: AppRouterConstructor<T>,
    options: RouterConfig
  ): Promise<T> {
    const mergedRoutes = await resolveRoutes(options);
    return new This(mergedRoutes, options);
  }

  constructor(protected history: RouterHistory) {}

  public async open(url: string): Promise<void> {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      const [schema, domainAndPath] = url.split('//', 2);
      const path =
        schema === 'http' || schema === 'https'
          ? `${domainAndPath.split('/', 1)[1] ?? ''}`
          : `${domainAndPath ?? ''}`;

      await this.history.open(path.startsWith('/') ? path : `/${path}`);
    }
  }
}
