import type { ActivatedRoute, Route, Routes } from '../types';
import type { AppRouterConstructor, InternalRouterConfig, RouterConfig } from './types';

import { AppRegistry } from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';

import { Router } from 'react-router';
import { Redirect, Route as Screen, Switch } from 'react-router-dom';

import { History } from '../History';
import { ActivatedRouteProvider, NavigatorProvider } from '../context';
import { buildPath, lazyComponent, StaticImplements } from '../utils';

import { AppRouterBase } from './AppRouterBase';
import { ModalProvider } from '../Modals/modal.provider';

@StaticImplements<AppRouterConstructor>()
export class AppRouter extends AppRouterBase {
  public static async register(options: RouterConfig & InternalRouterConfig): Promise<AppRouter> {
    const rootTag =
      (typeof options.root === 'string' ? document.querySelector(options.root) : options.root) ??
      document.getElementById('root');

    return {
      then: async callback => {
        const router = await super.createInstance(this, options);
        AppRegistry.runApplication('Flagship', {
          rootTag,
          initialProps: {}
        });

        return callback?.(router);
      }
    };
  }

  constructor(private readonly routes: Routes, private readonly routerOptions: RouterConfig) {
    super(new History(routes));
    this.registerRoutes();
  }

  private registerRoutes(): void {
    AppRegistry.registerComponent('Flagship', () => this.Outlet);
  }

  private constructRoutes = (route: Route, prefix?: string): JSX.Element | JSX.Element[] => {
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
      const LoadingPlaceholder = useMemo(() => () => <>{this.routerOptions.loading}</>, []);

      const LazyComponent = useMemo(
        () =>
          lazyComponent(
            async () => {
              const AwaitedComponent =
                'lazyComponent' in route ? await route.lazyComponent() : route.component;

              return React.memo(() => <AwaitedComponent key={path} />);
            },
            { fallback: <LoadingPlaceholder /> }
          ),
        [route]
      );

      return (
        <Screen key={id} path={path} exact={route.exact}>
          <ActivatedRouteProvider {...{ ...routeDetails, loading }}>
            <ModalProvider>
              <LazyComponent key={path} />
            </ModalProvider>
          </ActivatedRouteProvider>
        </Screen>
      );
    } else if ('redirect' in route) {
      return <Redirect key={id} path={path} to={route.redirect} exact={route.exact} />;
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
        <Switch>{this.routes.map(child => this.constructRoutes(child))}</Switch>
      </NavigatorProvider>
    );
  }

  private readonly Outlet = () => {
    const Routes = this.Routes;

    return (
      <Router history={this.history}>
        <Routes />
      </Router>
    );
  }
}
