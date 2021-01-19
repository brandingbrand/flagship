import type { ActivatedRoute, Route, Routes } from '../types';
import { AppRouterConstructor, AppRouterOptions } from './types';

import React, { useEffect, useMemo, useState } from 'react';
import { AppRegistry } from 'react-native';

import { Router } from 'react-router';
import { Redirect, Route as Screen, Switch } from 'react-router-dom';

import { ActivatedRouteProvider, NavigatorProvider } from '../context';
import { BrowserHistory } from '../History/BrowserHistory';

import { buildPath, lazyComponent, StaticImplements } from '../utils';

import { AppRouterBase } from './AppRouterBase';
import { resolveRoutes } from './utils';

@StaticImplements<AppRouterConstructor>()
export class AppRouter extends AppRouterBase {
  public static async register(
    options: AppRouterOptions & { name: string }
  ): Promise<AppRouter> {
    const mergedRoutes = await resolveRoutes(options);
    const router = new AppRouter(mergedRoutes, options);
    return router;
  }

  public constructor(
    private readonly routes: Routes,
    private readonly routerOptions: AppRouterOptions & { name: string }
  ) {
    super(new BrowserHistory(routes));
    this.registerRoutes();
  }

  private registerRoutes(): void {
    AppRegistry.registerComponent(this.routerOptions.name, () => this.Outlet);
    AppRegistry.runApplication(this.routerOptions.name, {
      initialProps: {},
      rootTag: document.getElementById('app-root')
    });
  }

  private constructRoutes = (
    route: Route,
    prefix?: string
  ): JSX.Element | JSX.Element[] => {
    const { id, path } = useMemo(() => buildPath(route, prefix), []);
    const [loading, setLoading] = useState(false);
    const [routeDetails, setRouteDetails] = useState<ActivatedRoute>();

    useEffect(() => {
      return this.history.observeLoading(setLoading);
    }, []);

    useEffect(() => {
      return this.history.registerResolver(id, setRouteDetails);
    }, []);

    if ('lazyComponent' in route || 'component' in route) {
      const LoadingPlaceholder = useMemo(
        () => () => <>{this.routerOptions.loading}</>,
        []
      );

      const LazyComponent = useMemo(
        () =>
          lazyComponent(
            async () => {
              const AwaitedComponent =
                'lazyComponent' in route
                  ? await route.lazyComponent()
                  : route.component;

              return React.memo(() => <AwaitedComponent key={path} />);
            },
            { fallback: <LoadingPlaceholder /> }
          ),
        [route]
      );

      return (
        <Screen key={id} path={path} exact={route.exact}>
          <ActivatedRouteProvider {...{ ...routeDetails, loading }}>
            <LazyComponent key={path} />
          </ActivatedRouteProvider>
        </Screen>
      );
    } else if ('redirect' in route) {
      return <Redirect key={id} path={path} to={route.redirect} />;
    } else if ('children' in route) {
      return route.children
        .map(child => this.constructRoutes(child, path))
        .reduce<JSX.Element[]>(
          (prev, next) => [...prev, ...(Array.isArray(next) ? next : [next])],
          []
        );
    }

    return <></>;
  }

  private readonly Routes = () => {
    return (
      <NavigatorProvider value={this.history}>
        <Switch>
          {this.routes.map(child => this.constructRoutes(child))}
        </Switch>
      </NavigatorProvider>
    );
  }

  private readonly Outlet = () => {
    return (
      <Router history={this.history}>
        <this.Routes />
      </Router>
    );
  }
}
