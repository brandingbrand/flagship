import type { ActivatedRoute, RouteData, RouteParams, RouteQuery } from '../types';

import React, { createContext, useMemo } from 'react';
import { defaults } from 'lodash-es';

import { InjectionToken } from '@brandingbrand/fslinker';

import { InjectedContextProvider, useDependencyContext } from '../../lib/use-dependency';

export const defaultActivatedRoute: ActivatedRoute = {
  path: undefined,
  loading: false,
  data: {},
  query: {},
  params: {},
};

export const LoadingContext = createContext<boolean>(defaultActivatedRoute.loading);
export const LOADING_CONTEXT_TOKEN = new InjectionToken<typeof LoadingContext>(
  'LOADING_CONTEXT_TOKEN'
);
export const useRouteLoading = () =>
  useDependencyContext(LOADING_CONTEXT_TOKEN) ?? defaultActivatedRoute.loading;

export const DataContext = createContext<Readonly<RouteData>>(defaultActivatedRoute.data);
export const DATA_CONTEXT_TOKEN = new InjectionToken<typeof DataContext>('DATA_CONTEXT_TOKEN');
export const useRouteData = () =>
  useDependencyContext(DATA_CONTEXT_TOKEN) ?? defaultActivatedRoute.data;

export const QueryContext = createContext<Readonly<RouteQuery>>(defaultActivatedRoute.query);
export const QUERY_CONTEXT_TOKEN = new InjectionToken<typeof QueryContext>('QUERY_CONTEXT_TOKEN');
export const useRouteQuery = () =>
  useDependencyContext(QUERY_CONTEXT_TOKEN) ?? defaultActivatedRoute.query;

export const ParamContext = createContext<Readonly<RouteParams>>(defaultActivatedRoute.params);
export const PARAM_CONTEXT_TOKEN = new InjectionToken<typeof ParamContext>('PARAM_CONTEXT_TOKEN');
export const useRouteParams = () =>
  useDependencyContext(PARAM_CONTEXT_TOKEN) ?? defaultActivatedRoute.params;

export const PathContext = createContext<string | undefined>(undefined);
export const PATH_CONTEXT_TOKEN = new InjectionToken<typeof PathContext>('PATH_CONTEXT_TOKEN');
export const useRoutePath = () => useDependencyContext(PATH_CONTEXT_TOKEN);

export const ActivatedRouteContext = createContext<Readonly<ActivatedRoute>>(defaultActivatedRoute);
export const ACTIVATED_ROUTE_CONTEXT_TOKEN = new InjectionToken<typeof ActivatedRouteContext>(
  'ACTIVATED_ROUTE_CONTEXT_TOKEN'
);
export const useActivatedRoute = () =>
  useDependencyContext(ACTIVATED_ROUTE_CONTEXT_TOKEN) ?? defaultActivatedRoute;

export const ActivatedRouteProvider: React.FC<Partial<ActivatedRoute>> = ({
  children,
  ...details
}) => {
  const parentActivatedRoute = useActivatedRoute();
  const activatedRoute = useMemo(
    () => defaults({}, details, parentActivatedRoute, defaultActivatedRoute),
    [details, parentActivatedRoute]
  );

  return (
    <InjectedContextProvider token={PATH_CONTEXT_TOKEN} value={activatedRoute.path}>
      <InjectedContextProvider token={LOADING_CONTEXT_TOKEN} value={activatedRoute.loading}>
        <InjectedContextProvider token={QUERY_CONTEXT_TOKEN} value={activatedRoute.query}>
          <InjectedContextProvider token={PARAM_CONTEXT_TOKEN} value={activatedRoute.params}>
            <InjectedContextProvider token={DATA_CONTEXT_TOKEN} value={activatedRoute.data}>
              <InjectedContextProvider token={ACTIVATED_ROUTE_CONTEXT_TOKEN} value={activatedRoute}>
                {children}
              </InjectedContextProvider>
            </InjectedContextProvider>
          </InjectedContextProvider>
        </InjectedContextProvider>
      </InjectedContextProvider>
    </InjectedContextProvider>
  );
};
