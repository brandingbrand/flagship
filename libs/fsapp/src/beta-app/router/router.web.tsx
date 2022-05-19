import type { FC } from 'react';
import React, { Fragment, useEffect, useLayoutEffect, useMemo, useState } from 'react';

import { AppRegistry } from 'react-native';
import { Router } from 'react-router';
import { Route as Screen, Switch } from 'react-router-dom';

import { Injector } from '@brandingbrand/fslinker';

import { noop } from 'lodash-es';
import pathToRegexp from 'path-to-regexp';

import { VersionOverlay } from '../development';
import { ModalProvider } from '../modal';
import { WEB_SHELL_CONTEXT_TOKEN, WebShellContext, WebShellProvider } from '../shell.web';
import { StaticImplements, buildPath, lazyComponent } from '../utils';

import {
  ActivatedRouteProvider,
  NavigatorProvider,
  defaultActivatedRoute,
  useActivatedRoute,
  useNavigator,
} from './context';
import { History } from './history';
import { FSRouterBase } from './router.base';
import type {
  ActivatedRoute,
  FSRouterConstructor,
  InternalRouterConfig,
  RedirectRoute,
  Route,
  RouterConfig,
} from './types';
import { Routes } from './types';
import { guardRoute, trackView } from './utils';

export { NAVIGATOR_TOKEN } from './context/navigator.context';

interface ScreenMixinProps {
  route: Route;
}

const Guarded: FC<ScreenMixinProps> = ({ children, route }) => {
  const { data, loading, ...activatedRoute } = useActivatedRoute();
  const [show, setShow] = useState(false);

  useLayoutEffect(() => {
    guardRoute(route, activatedRoute).then(setShow).catch(noop);
  }, [navigator, activatedRoute.params, activatedRoute.path, activatedRoute.query]);

  return show ? <React.Fragment>{children}</React.Fragment> : null;
};

interface RedirectProps {
  route: RedirectRoute;
}

const Redirect: FC<RedirectProps> = ({ route }) => {
  const navigator = useNavigator();
  const { data, loading, ...activatedRoute } = useActivatedRoute();

  useLayoutEffect(() => {
    const redirect =
      typeof route.redirect === 'string' ? route.redirect : route.redirect(activatedRoute);

    guardRoute(route, activatedRoute)
      .then((allowed) => {
        if (allowed) {
          navigator.open(`/${redirect.replace(/^\//, '')}`);
        }
      })
      .catch(noop);
  }, [navigator, activatedRoute.params, activatedRoute.path, activatedRoute.query]);

  return null;
};

@StaticImplements<FSRouterConstructor>()
export class FSRouter extends FSRouterBase {
  constructor(routes: Routes, private readonly options: InternalRouterConfig & RouterConfig) {
    super(routes, new History(routes, { basename: options.basename }));
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

  private readonly constructScreen = (
    route: Route,
    loading: boolean,
    routeDetails: ActivatedRoute,
    prefix?: string
  ): JSX.Element | JSX.Element[] => {
    const { id, path } = useMemo(() => buildPath(route, prefix), []);
    const [filteredRoute, setFilteredRoute] = useState(() => routeDetails);

    useLayoutEffect(() => {
      const isMatch = () => {
        if (!path) {
          return path === routeDetails.url;
        } else if (!routeDetails.url) {
          return false;
        }

        return Boolean(pathToRegexp(path).test(routeDetails.url.split('?')[0] ?? ''));
      };

      if (isMatch()) {
        setFilteredRoute(routeDetails);
      }
    }, [routeDetails]);

    if ('loadComponent' in route || 'component' in route) {
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
        <Screen exact={route.exact} key={id} path={path}>
          <ActivatedRouteProvider {...filteredRoute} loading={loading}>
            <Guarded route={route}>
              <ModalProvider screenWrap={this.options.screenWrap}>
                <LazyComponent componentId={id} />
              </ModalProvider>
            </Guarded>
          </ActivatedRouteProvider>
        </Screen>
      );
    } else if ('redirect' in route) {
      return (
        <Screen exact={route.exact} key={id} path={path}>
          <ActivatedRouteProvider {...filteredRoute} loading={loading}>
            <Redirect route={route} />
          </ActivatedRouteProvider>
        </Screen>
      );
    } else if ('children' in route) {
      return route.children
        .map((child) => this.constructScreen(child, loading, routeDetails, path))
        .reduce<JSX.Element[]>(
          (prev, next) => [...prev, ...(Array.isArray(next) ? next : [next])],
          []
        );
    }

    return <React.Fragment />;
  };

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
          <WebShellProvider {...this.options.shell}>
            <VersionOverlay>
              <Router history={this.history}>
                <Switch>
                  {this.routes.map((route) => this.constructScreen(route, loading, routeDetails))}
                </Switch>
              </Router>
            </VersionOverlay>
          </WebShellProvider>
        </ModalProvider>
      </NavigatorProvider>
    );
  };
}
