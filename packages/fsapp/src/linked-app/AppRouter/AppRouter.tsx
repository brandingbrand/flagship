import type { ActivatedRoute, Route, Routes } from '../types';
import type { AppRouterConstructor, InternalRouterConfig, RouterConfig } from './types';

import { Linking } from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { Navigation, NavigationFunctionComponent, OptionsBottomTab } from 'react-native-navigation';

import { History, stringifyLocation } from '../History';
import { ActivatedRouteProvider, NavigatorProvider } from '../context';
import { buildPath, lazyComponent, StaticImplements } from '../utils';

import { AppRouterBase } from './AppRouterBase';

const LAST_SCREEN_KEY = 'lastScreen';
const DEV_KEEP_SCREEN = 'devKeepPage';

@StaticImplements<AppRouterConstructor>()
export class AppRouter extends AppRouterBase {
  public static async register(options: RouterConfig & InternalRouterConfig): Promise<AppRouter> {
    return {
      then: async callback => {
        const router = await super.createInstance(this, options);
        Navigation.events().registerAppLaunchedListener(async () => {
          Linking.addEventListener('url', ({ url }) => router.open(url));

          const url = await Linking.getInitialURL();
          if (url) {
            await router.open(url);
          } else {
            const keepLastScreen = await AsyncStorage.getItem(DEV_KEEP_SCREEN);
            if (keepLastScreen === 'true') {
              const url = await AsyncStorage.getItem(LAST_SCREEN_KEY);
              if (url) {
                await router.open(url);
              }
            }
          }

          callback?.(router);
        });
      }
    };
  }

  constructor(routes: Routes, private readonly options: RouterConfig) {
    super(new History(routes));
    this.registerRoutes(routes);
    this.trackCurrentPage();
  }

  private trackCurrentPage(): void {
    this.history.listen(async location => {
      try {
        const keepLastScreen = await AsyncStorage.getItem(DEV_KEEP_SCREEN);

        if (keepLastScreen === 'true') {
          await AsyncStorage.setItem(LAST_SCREEN_KEY, JSON.stringify(stringifyLocation(location)));
        }

      } catch (e) {
        console.log('Cannot get lastScreen from AsyncStorage', e);
      }
    });
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
