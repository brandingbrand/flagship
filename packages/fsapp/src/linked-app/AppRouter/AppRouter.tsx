import type { AppRouterConstructor, RouterConfig } from './types';
import type { ActivatedRoute, Route, Routes } from '../types';

import React, { useEffect, useMemo, useState } from 'react';
import { Navigation, NavigationFunctionComponent, OptionsBottomTab } from 'react-native-navigation';

import { ActivatedRouteProvider, NavigatorProvider } from '../context';
import { NativeHistory } from '../History/NativeHistory';
import { buildPath, lazyComponent, StaticImplements } from '../utils';

import { AppRouterBase } from './AppRouterBase';
import { resolveRoutes } from './utils';

@StaticImplements<AppRouterConstructor>()
export class AppRouter extends AppRouterBase {
  public static async register(options: RouterConfig): Promise<AppRouter> {
    const mergedRoutes = await resolveRoutes(options);
    const router = new AppRouter(mergedRoutes, options);
    return new Promise(resolve => {
      Navigation.events().registerAppLaunchedListener(() => {
        resolve(router);
      });
    });
  }

  private constructor(routes: Routes, private readonly options: RouterConfig) {
    super(new NativeHistory(routes));
    this.registerRoutes(routes);
  }

  private registerRoutes(
    routes: Routes,
    prefix: string = '',
    tab?: string | OptionsBottomTab
  ): void {
    routes.forEach((route: Route) => {
      const { path, id } = buildPath(route, prefix);
      let routeDetails: ActivatedRoute = {
        data: {},
        params: {},
        query: {},
        loading: true
      };
      this.history.registerResolver(id, details => {
        routeDetails = details;
      });
      const LoadingPlaceholder = () => <>{this.options.loading}</>;
      if ('component' in route || 'lazyComponent' in route) {
        const LazyComponent = lazyComponent(
          async () => {
            const AwaitedComponent =
              'component' in route ? route.component : await route.lazyComponent();

            return () => {
              const [loading, setLoading] = useState(false);
              const activatedRoute = useMemo(() => routeDetails, []);
              useEffect(() => this.history.observeLoading(setLoading), []);

              return (
                <ActivatedRouteProvider {...activatedRoute} loading={loading}>
                  <AwaitedComponent />
                </ActivatedRouteProvider>
              );
            };
          },
          { fallback: <LoadingPlaceholder /> }
        );

        const WrappedComponent: NavigationFunctionComponent = () => (
          <NavigatorProvider value={this.history}>
            <LazyComponent />
          </NavigatorProvider>
        );
        WrappedComponent.options = {
          bottomTab: typeof tab === 'string' ? { text: tab } : tab
        };
        Navigation.registerComponent(id, () => WrappedComponent);
      } else if ('redirect' in route) {
        return;
      } else if ('children' in route) {
        const tabAffinity = 'tab' in route ? route.tab : tab;
        this.registerRoutes(route.children, path, tabAffinity);
      }
    });
  }
}
