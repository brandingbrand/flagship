import type {
  ExternalRoute,
  ExternalRoutes,
  FSRouterConstructor,
  InternalRouterConfig,
  Route,
  RouteCollection,
  RouterConfig,
  Routes,
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
  NavigatorProvider,
} from './context';
import { FSRouterBase } from './router.base';
import { trackView } from './utils';

export { NAVIGATOR_TOKEN } from './context/navigator.context';

// This is a hack. I am not happy about having to do this hack.
// But it is required for Android. If no components are registered
// Synchronously then errors are thrown and touch responses are eaten.
Navigation.registerComponent('noop', () => () => null);

@StaticImplements<FSRouterConstructor>()
export class FSRouter extends FSRouterBase {
  constructor(routes: Routes, private readonly options: RouterConfig & InternalRouterConfig) {
    super(routes, new History(routes));
    this.registerRoutes(routes);
    this.trackCurrentPage();
  }

  private trackCurrentPage(): void {
    this.history.listen(async (location) => {
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
    const addedRoutes = new Set<string>();

    // eslint-disable-next-line complexity
    routes.forEach((route: RouteCollection | Route | ExternalRoute) => {
      const { path, id } = buildPath(route, prefix);

      if (!addedRoutes.has(id)) {
        const LoadingPlaceholder = () => <>{this.options.loading}</>;
        if ('component' in route || 'loadComponent' in route) {
          let routeDetails = defaultActivatedRoute;
          this.history.registerResolver(id, (details) => {
            routeDetails = details;
          });
          const LazyComponent = lazyComponent<{ componentId: string }>(
            async () => {
              const AwaitedComponent =
                'component' in route ? route.component : await route.loadComponent(routeDetails);

              return ({ componentId }) => {
                const [loading, setLoading] = useState(false);
                const activatedRoute = useMemo(() => routeDetails, []);
                useEffect(() => this.history.observeLoading(setLoading), []);

                useEffect(() => {
                  trackView(this.options.analytics, route, activatedRoute, path);
                }, [activatedRoute]);

                return (
                  <ActivatedRouteProvider {...activatedRoute} loading={loading}>
                    <ModalProvider screenWrap={this.options.screenWrap}>
                      <ButtonProvider>
                        <VersionOverlay>
                          <AwaitedComponent componentId={componentId} />
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
          const WrappedComponent: NavigationFunctionComponent = ({ componentId }) => (
            <Wrapper>
              <NavigatorProvider value={this.history}>
                <LazyComponent componentId={componentId} />
              </NavigatorProvider>
            </Wrapper>
          );
          WrappedComponent.options = {
            bottomTab: typeof tab === 'string' ? { text: tab } : tab,
          };
          Navigation.registerComponent(id, () => WrappedComponent);
          addedRoutes.add(id);
        } else if ('redirect' in route) {
          return;
        } else if ('children' in route) {
          const tabAffinity = 'tab' in route ? route.tab : tab;
          this.registerRoutes(
            route.children,
            'tab' in route ? '' : path,
            'tabAffinity' in route ? route.tabAffinity : tabAffinity
          );
        }
      }
    });
  }
}
