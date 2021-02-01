import type {
  ActivatedRoute,
  FSRouterConstructor,
  InternalRouterConfig,
  Route,
  RouterConfig,
  Routes
} from './types';

import { AppRegistry } from 'react-native';
import React, { Fragment, useEffect, useMemo, useState } from 'react';

import { Router } from 'react-router';
import { Redirect, Route as Screen, Switch } from 'react-router-dom';
import pathToRegexp from 'path-to-regexp';

import { buildPath, lazyComponent, StaticImplements } from '../utils';
import { VersionOverlay } from '../development';
import { WebShellProvider } from '../shell.web';
import { ModalProvider } from '../modal';

import { ActivatedRouteProvider, NavigatorProvider } from './context';
import { FSRouterBase } from './router.base';
import { History } from './history';
import { trackView } from './utils';

@StaticImplements<FSRouterConstructor>()
export class FSRouter extends FSRouterBase {
  constructor(routes: Routes, private readonly options: RouterConfig & InternalRouterConfig) {
    super(routes, new History(routes));
    this.registerRoutes();
  }

  private registerRoutes(): void {
    const Wrapper = this.options.screenWrap ?? Fragment;
    AppRegistry.registerComponent('Flagship', () => () => (
      <Wrapper>
        <this.Outlet />
      </Wrapper>
    ));
  }

  private constructScreen = (
    route: Route,
    loading: boolean,
    routeDetails?: ActivatedRoute,
    prefix?: string
  ): JSX.Element | JSX.Element[] => {
    const { id, path } = useMemo(() => buildPath(route, prefix), []);

    if ('lazyComponent' in route || 'component' in route) {
      const [filteredRoute, setFilteredRoute] = useState(() => routeDetails);
      useEffect(() => {
        const isMatch = () => {
          if (!path) {
            return path === routeDetails?.path;
          } else if (!routeDetails?.path) {
            return false;
          }

          return !!pathToRegexp(path).exec(routeDetails.path.split('?')[0]);
        };

        if (isMatch()) {
          setFilteredRoute(routeDetails);
        }
      }, [routeDetails]);

      const LazyComponent = useMemo(
        () =>
          lazyComponent(
            async () => {
              const AwaitedComponent =
                'lazyComponent' in route ? await route.lazyComponent() : route.component;

              return React.memo(() => {
                useEffect(() => {
                  trackView(this.options.analytics, route, filteredRoute, path);
                }, [filteredRoute]);

                return <AwaitedComponent />;
              });
            },
            { fallback: this.options.loading }
          ),
        [route]
      );

      return (
        <Screen key={id} path={path} exact={route.exact}>
          <ActivatedRouteProvider {...filteredRoute} loading={loading}>
            <ModalProvider>
              <LazyComponent />
            </ModalProvider>
          </ActivatedRouteProvider>
        </Screen>
      );
    } else if ('redirect' in route) {
      return <Redirect key={id} path={path} to={route.redirect} exact={route.exact} />;
    } else if ('children' in route) {
      return route.children
        .map(child => this.constructScreen(child, loading, routeDetails, path))
        .reduce<JSX.Element[]>(
          (prev, next) => [...prev, ...(Array.isArray(next) ? next : [next])],
          []
        );
    }

    return <></>;
  }

  private readonly Outlet = () => {
    const [loading, setLoading] = useState(false);
    const [routeDetails, setRouteDetails] = useState<ActivatedRoute>();

    const stopListening = useMemo(() => {
      const stopDetailsListening = this.history.registerResolver(setRouteDetails);
      const stopLoadingListening = this.history.observeLoading(setLoading);

      return () => {
        stopDetailsListening();
        stopLoadingListening();
      };
    }, []);

    useEffect(() => stopListening, []);

    return (
      <NavigatorProvider value={this.history}>
        <ModalProvider>
          <VersionOverlay>
            <WebShellProvider {...this.options.shell}>
              <Router history={this.history}>
                <Switch>
                  {this.routes.map(route => this.constructScreen(route, loading, routeDetails))}
                </Switch>
              </Router>
            </WebShellProvider>
          </VersionOverlay>
        </ModalProvider>
      </NavigatorProvider>
    );
  }
}
