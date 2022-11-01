import React, { Fragment, useEffect, useMemo, useState } from 'react';

import type { NavigationFunctionComponent, OptionsBottomTab } from 'react-native-navigation';
import { Navigation } from 'react-native-navigation';

import lazyComponent from '@loadable/component';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { DEV_KEEP_SCREEN, LAST_SCREEN_KEY } from '../constants';
import { VersionOverlay } from '../development/version-overlay.component';
import { ModalProvider } from '../modal';
import { StaticImplements, buildPath } from '../utils';

import {
  ActivatedRouteProvider,
  ButtonProvider,
  NavigatorProvider,
  defaultActivatedRoute,
} from './context';
import { History, stringifyLocation } from './history';
import { FSRouterBase } from './router.base';
import type {
  ActivatedRoute,
  ExternalRoute,
  ExternalRoutes,
  FSRouterConstructor,
  InternalRouterConfig,
  Route,
  RouteCollection,
  RouterConfig,
} from './types';
import { Routes } from './types';
import { trackView } from './utils';

export { NAVIGATOR_TOKEN } from './context/navigator.context';

// This is a hack. I am not happy about having to do this hack.
// But it is required for Android. If no components are registered
// Synchronously then errors are thrown and touch responses are eaten.
Navigation.registerComponent('noop', () => () => null);

@StaticImplements<FSRouterConstructor>()
export class FSRouter extends FSRouterBase {
  constructor(routes: Routes, private readonly options: InternalRouterConfig & RouterConfig) {
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
      } catch (error) {
        console.log('Cannot get lastScreen from AsyncStorage', error);
      }
    });
  }

  private registerRoutes(
    routes: ExternalRoutes | Routes,
    prefix = '',
    tab?: OptionsBottomTab | string
  ): void {
    const addedRoutes = new Set<string>();

    routes.forEach((route: ExternalRoute | Route | RouteCollection) => {
      const { id, path } = buildPath(route, prefix);

      if (!addedRoutes.has(id)) {
        const LoadingPlaceholder: React.FC = () => (
          <React.Fragment>{this.options.loading}</React.Fragment>
        );
        if ('component' in route || 'loadComponent' in route) {
          let routeDetails = defaultActivatedRoute;
          const routeDetailCache = new Map<string, ActivatedRoute>();
          this.history.registerResolver(
            id,
            (details) => {
              routeDetails = details;
              if (typeof details.id === 'string') {
                routeDetailCache.set(details.id, details);
              }
            },
            (location) => {
              if (typeof location.key === 'string') {
                routeDetailCache.delete(location.key);
              }
            }
          );
          const LazyComponent = lazyComponent<{ componentId: string }>(
            async () => {
              const AwaitedComponent =
                'component' in route ? route.component : await route.loadComponent(routeDetails);
              const MemoizedComponent = React.memo<{ componentId: string }>(({ componentId }) => (
                <AwaitedComponent componentId={componentId} />
              ));

              return ({ componentId }) => {
                const [isLoading, setIsLoading] = useState(false);
                const activatedRoute = useMemo(
                  () => routeDetailCache.get(componentId) ?? routeDetailCache.get(id),
                  [componentId]
                );
                useEffect(() => this.history.observeLoading(setIsLoading), []);

                useEffect(() => {
                  const subscription = Navigation.events().registerComponentDidAppearListener(
                    (appearingComponent) => {
                      if (componentId === appearingComponent.componentId) {
                        trackView(this.options.analytics, route, activatedRoute);
                      }
                    }
                  );

                  return () => {
                    subscription.remove();
                  };
                }, [activatedRoute, componentId]);

                return (
                  <ActivatedRouteProvider {...activatedRoute} loading={isLoading}>
                    <ModalProvider screenWrap={this.options.screenWrap}>
                      <ButtonProvider>
                        <VersionOverlay>
                          <MemoizedComponent componentId={componentId} />
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
