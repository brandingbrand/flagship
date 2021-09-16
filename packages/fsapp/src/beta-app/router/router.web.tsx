import type {
  ActivatedRoute,
  FSRouterConstructor,
  InternalRouterConfig,
  RedirectRoute,
  Route,
  RouterConfig,
  Routes
} from './types';

import { AppRegistry } from 'react-native';
import React, { Fragment, useEffect, useLayoutEffect, useMemo, useState } from 'react';

import { Router } from 'react-router';
import { Route as Screen, Switch } from 'react-router-dom';
import pathToRegexp from 'path-to-regexp';

import { Injector } from '@brandingbrand/fslinker';

import { buildPath, lazyComponent, StaticImplements } from '../utils';
import { VersionOverlay } from '../development';
import { WEB_SHELL_CONTEXT_TOKEN, WebShellContext, WebShellProvider } from '../shell.web';
import { ModalProvider } from '../modal';

import {
  ActivatedRouteProvider,
  defaultActivatedRoute,
  NavigatorProvider,
  useActivatedRoute,
  useNavigator
} from './context';
import { FSRouterBase } from './router.base';
import { History } from './history';
import { trackView } from './utils';

export { NAVIGATOR_TOKEN } from './context/navigator.context';

interface RedirectProps {
  to: Pick<RedirectRoute, 'redirect'>['redirect'];
}

const Redirect = ({ to }: RedirectProps) => {
  const navigator = useNavigator();
  const { loading, data, ...activatedRoute } = useActivatedRoute();

  useLayoutEffect(() => {
    const redirect = typeof to === 'string' ? to : to(activatedRoute);
    navigator.open(`/${redirect}`);
  }, [navigator, activatedRoute.params, activatedRoute.path, activatedRoute.query]);

  return null;
};

@StaticImplements<FSRouterConstructor>()
export class FSRouter extends FSRouterBase {
  constructor(routes: Routes, private readonly options: RouterConfig & InternalRouterConfig) {
    super(routes, new History(routes));
    Injector.provide({ provide: WEB_SHELL_CONTEXT_TOKEN, useValue: WebShellContext });
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
    routeDetails: ActivatedRoute,
    prefix?: string
  ): JSX.Element | JSX.Element[] => {
    const { id, path } = useMemo(() => buildPath(route, prefix), []);

    if ('loadComponent' in route || 'component' in route) {
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
          lazyComponent<{ componentId: string }>(
            async () => {
              const AwaitedComponent =
                'loadComponent' in route
                  ? await route.loadComponent(routeDetails)
                  : route.component;

              return React.memo(({ componentId }) => {
                useEffect(() => {
                  trackView(this.options.analytics, route, filteredRoute, path);
                }, [filteredRoute]);

                return <AwaitedComponent componentId={componentId} />;
              });
            },
            { fallback: this.options.loading }
          ),
        [route]
      );

      return (
        <Screen key={id} path={path} exact={route.exact}>
          <ActivatedRouteProvider {...filteredRoute} loading={loading}>
            <ModalProvider screenWrap={this.options.screenWrap}>
              <LazyComponent componentId={id} />
            </ModalProvider>
          </ActivatedRouteProvider>
        </Screen>
      );
    } else if ('redirect' in route) {
      return (
        <Screen key={id} path={path} exact={route.exact}>
          <Redirect to={route.redirect} />
        </Screen>
      );
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
    const [routeDetails, setRouteDetails] = useState<ActivatedRoute>(defaultActivatedRoute);

    const stopListening = useMemo(() => {
      const stopDetailsListening = this.history.registerResolver('all', setRouteDetails);
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
