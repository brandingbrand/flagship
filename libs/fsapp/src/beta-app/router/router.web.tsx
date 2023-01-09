import type { FC } from 'react';
import React, {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';

import { AppRegistry } from 'react-native';
import { Router, useLocation, useRouteMatch } from 'react-router';
import { Route as Screen, matchPath } from 'react-router-dom';

import { Injector } from '@brandingbrand/fslinker';

import lazyComponent from '@loadable/component';
import { noop } from 'lodash-es';
import { useObservableState } from 'observable-hooks';
import pathToRegexp from 'path-to-regexp';
import { ReplaySubject, take } from 'rxjs';

import { VersionOverlay } from '../development';
import { useServerLayoutEffect, useServerObservableState } from '../hydratable';
import { ModalProvider } from '../modal';
import { WEB_SHELL_CONTEXT_TOKEN, WebShellContext, WebShellProvider } from '../shell.web';
import { StaticImplements, buildPath } from '../utils';

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
  ScreenComponentType,
} from './types';
import { Routes } from './types';
import { guardRoute, trackView } from './utils';

export { NAVIGATOR_TOKEN } from './context/navigator.context';

interface ScreenMixinProps {
  route: Route;
  id: string;
}

const GuardContext = React.createContext(
  async (
    _id: React.Key,
    _route: Route,
    _canActivate: () => Promise<boolean> | boolean
  ): Promise<boolean> => {
    throw new Error('Called outside of GuardContext');
  }
);

const Switch: FC = ({ children }) => {
  const location = useLocation();
  const match = useRouteMatch();
  const [blockedRoutes, setBlockedRoutes] = useState<Map<React.Key, Route>>(() => new Map());

  const [element, computedMatch] = useMemo(() => {
    let element: React.ReactElement | null = null;
    let computedMatch: typeof match | null = null;

    // We use React.Children.forEach instead of React.Children.toArray().find()
    // here because toArray adds keys to all child elements and we do not want
    // to trigger an unmount/remount for two <Route>s that render the same
    // component at different URLs.
    React.Children.forEach(children, (child) => {
      if (computedMatch === null && React.isValidElement(child)) {
        element = child;

        if (child.key && blockedRoutes.has(child.key)) {
          return;
        }

        const path = child.props.path || child.props.from;
        computedMatch = path ? matchPath(location.pathname, { ...child.props, path }) : match;
      }
    });

    return [element, computedMatch];
  }, [blockedRoutes, children, location.pathname, match]);

  const runGuard = useCallback(
    async (id: React.Key, route: Route, canActivate: () => Promise<boolean> | boolean) => {
      const willActivate = await canActivate();

      if (!willActivate) {
        setBlockedRoutes((currentBlockedRoutes) => new Map([...currentBlockedRoutes, [id, route]]));
      }

      return willActivate;
    },
    []
  );

  // Note: This is a hack because `canActivate()` is being checked via the React
  // render cycle rather than outside of it
  useLayoutEffect(() => {
    if (location.pathname === '/') {
      setBlockedRoutes(new Map());
    } else {
      // When not navigating back to `/` preserve
      // any blockedRoutes that match the updated location
      // so that updating route params does not trigger
      // unmounting screens that may still match
      setBlockedRoutes((currentBlockedRoutes) => {
        const update = new Map();
        for (const [id, blockedRoute] of currentBlockedRoutes.entries()) {
          const path = blockedRoute.path !== undefined ? `/${blockedRoute.path}` : '/';
          const matcher = pathToRegexp(path, { end: Boolean(blockedRoute.exact) });
          if (matcher.test(location.pathname)) {
            update.set(id, blockedRoute);
          }
        }

        return update;
      });
    }
  }, [location]);

  return computedMatch && element ? (
    <GuardContext.Provider value={runGuard}>
      {React.cloneElement(element, { location, computedMatch })}
    </GuardContext.Provider>
  ) : null;
};

const Guarded: FC<ScreenMixinProps> = ({ children, id, route }) => {
  const { data, loading, ...activatedRoute } = useActivatedRoute();
  const [shouldShow, setShouldShow] = useState(() => !('canActivate' in route));
  const runGuard = useContext(GuardContext);

  useLayoutEffect(() => {
    let isMounted = true;
    runGuard(id, route, async () => guardRoute(route, activatedRoute))
      .then((allowed) => {
        if (isMounted) {
          setShouldShow(allowed);
        }
      })
      .catch(noop);

    return () => {
      isMounted = false;
    };
  }, [
    activatedRoute.params,
    activatedRoute.path,
    activatedRoute.query,
    route,
    activatedRoute,
    runGuard,
    id,
  ]);

  return shouldShow ? <React.Fragment>{children}</React.Fragment> : null;
};

interface RedirectProps {
  id: string;
  route: RedirectRoute;
}

const Redirect: FC<RedirectProps> = ({ id, route }) => {
  const navigator = useNavigator();
  const { data, loading, ...activatedRoute } = useActivatedRoute();
  const runGuard = useContext(GuardContext);

  useLayoutEffect(() => {
    const redirect =
      typeof route.redirect === 'string' ? route.redirect : route.redirect(activatedRoute);

    runGuard(id, route, async () => guardRoute(route, activatedRoute))
      .then((allowed) => {
        if (allowed) {
          navigator.open(`/${redirect.replace(/^\//, '')}`);
        }
      })
      .catch(noop);
  }, [
    route,
    navigator,
    activatedRoute.params,
    activatedRoute.path,
    activatedRoute.query,
    activatedRoute,
    id,
    runGuard,
  ]);

  return null;
};

@StaticImplements<FSRouterConstructor>()
export class FSRouter extends FSRouterBase {
  constructor(routes: Routes, private readonly options: InternalRouterConfig & RouterConfig) {
    const history = new History(routes, {
      basename: options.basename,
      location: options.location,
      markStable: () => {
        this.isStable$.next(true);
      },
    });
    super(routes, history);
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
    const { id, path } = useMemo(() => buildPath(route, prefix), [prefix, route]);
    const filteredRoute$ = useMemo(() => new ReplaySubject<ActivatedRoute>(1), []);

    useServerLayoutEffect(
      id,
      () => {
        const isMatch = (): boolean => {
          if (path === '/') {
            return !route.exact || path === routeDetails.url;
          } else if (!routeDetails.url) {
            return false;
          }

          return Boolean(
            pathToRegexp(path, { end: Boolean(route.exact) }).test(
              routeDetails.url.split('?')[0] ?? ''
            )
          );
        };

        if (isMatch()) {
          filteredRoute$.next(routeDetails);
        }
      },
      [path, route.exact, routeDetails, filteredRoute$]
    );

    const filteredRoute = useServerObservableState(filteredRoute$, defaultActivatedRoute);

    if ('loadComponent' in route || 'component' in route) {
      const LazyComponent = useMemo(() => {
        const makeTrackedComponent = (
          Component: ScreenComponentType
        ): React.FC<{ componentId: string }> =>
          React.memo(({ componentId }) => {
            const internalFilterRoute = useObservableState(filteredRoute$, defaultActivatedRoute);

            useEffect(() => {
              trackView(this.options.analytics, route, internalFilterRoute);
            }, [internalFilterRoute]);

            return <Component componentId={componentId} />;
          });

        if ('component' in route) {
          return makeTrackedComponent(route.component);
        }

        return lazyComponent<{ componentId: string }>(
          async () => makeTrackedComponent(await route.loadComponent(filteredRoute)),
          { fallback: this.options.loading }
        );
      }, [filteredRoute$, route]);

      return (
        <Screen exact={route.exact} key={id} path={path}>
          <ActivatedRouteProvider {...filteredRoute} loading={loading}>
            <Guarded id={id} route={route}>
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
            <Redirect id={id} route={route} />
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

  private readonly Outlet = (): JSX.Element => {
    const [isLoading, setIsLoading] = useState(false);
    const [routeDetails, setRouteDetails] = useState<ActivatedRoute>(
      () => this.history.activatedRoute ?? defaultActivatedRoute
    );

    const stopListening = useMemo(() => {
      const stopDetailsListening = this.history.registerResolver('all', setRouteDetails);
      const stopLoadingListening = this.history.observeLoading(setIsLoading);

      return () => {
        stopDetailsListening();
        stopLoadingListening();
      };
    }, []);

    useEffect(() => stopListening, []);

    return (
      <NavigatorProvider value={this.history}>
        <ActivatedRouteProvider {...routeDetails} loading={isLoading}>
          <ModalProvider>
            <WebShellProvider {...this.options.shell}>
              <VersionOverlay>
                <Router history={this.history}>
                  <Switch>
                    {this.routes.map((route) =>
                      this.constructScreen(route, isLoading, routeDetails)
                    )}
                  </Switch>
                </Router>
              </VersionOverlay>
            </WebShellProvider>
          </ModalProvider>
        </ActivatedRouteProvider>
      </NavigatorProvider>
    );
  };
}
