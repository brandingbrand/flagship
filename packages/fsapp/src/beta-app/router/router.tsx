import type {
  ExternalRoute,
  ExternalRoutes,
  FSRouterConstructor,
  InternalRouterConfig,
  Route,
  RouterConfig,
  Routes
} from './types';

import React, { Fragment, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { Navigation, NavigationFunctionComponent, OptionsBottomTab } from 'react-native-navigation';

import { History, stringifyLocation } from './history';
import { buildPath, lazyComponent, StaticImplements } from '../utils';
import { DEV_KEEP_SCREEN, LAST_SCREEN_KEY } from '../constants';
import { VersionOverlay } from '../development/version-overlay.component';
import { ModalProvider } from '../modal';

import {
  ActivatedRouteProvider,
  ButtonProvider,
  defaultActivatedRoute,
  NavigatorProvider
} from './context';
import { FSRouterBase } from './router.base';
import { trackView } from './utils';

@StaticImplements<FSRouterConstructor>()
export class FSRouter extends FSRouterBase {
  constructor(routes: Routes, private readonly options: RouterConfig & InternalRouterConfig) {
    super(routes, new History(routes));
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
    routes: Routes | ExternalRoutes,
    prefix: string = '',
    tab?: string | OptionsBottomTab
  ): void {
    let routeDetails = defaultActivatedRoute;
    this.history.registerResolver(details => {
      routeDetails = details;
    });

    routes.forEach((route: Route | ExternalRoute) => {
      const { path, id } = buildPath(route, prefix);
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

              useEffect(() => {
                trackView(this.options.analytics, route, activatedRoute, path);
              }, [activatedRoute]);

              return (
                <ActivatedRouteProvider {...activatedRoute} loading={loading}>
                  <ModalProvider>
                    <ButtonProvider>
                      <VersionOverlay>
                        <AwaitedComponent />
                      </VersionOverlay>
                    </ButtonProvider>
                  </ModalProvider>
                </ActivatedRouteProvider>
              );
            };
          },
          { fallback: <LoadingPlaceholder /> }
        );

        const Wrapper = this.options.screenWrap ?? Fragment;
        const WrappedComponent: NavigationFunctionComponent = () => (
          <Wrapper>
            <NavigatorProvider value={this.history}>
              <LazyComponent />
            </NavigatorProvider>
          </Wrapper>
        );
        WrappedComponent.options = {
          bottomTab: typeof tab === 'string' ? { text: tab } : tab
        };
        Navigation.registerComponent(id, () => WrappedComponent);
      } else if ('redirect' in route) {
        return;
      } else if ('children' in route) {
        const tabAffinity = 'tab' in route ? route.tab : tab;
        this.registerRoutes(
          route.children,
          path,
          'tabAffinity' in route ? route.tabAffinity : tabAffinity
        );
      }
    });
  }
}
