import type { ActivatedRoute, RouteData, RouteParams, RouteQuery } from '../types';

import React, { createContext, useContext, useMemo } from 'react';
import { defaults } from 'lodash-es';

const defaultActivatedRoute = {
  path: undefined,
  loading: false,
  data: {},
  query: {},
  params: {}
};

export const LoadingContext = createContext<boolean>(defaultActivatedRoute.loading);
export const useRouteLoading = () => useContext(LoadingContext);

export const DataContext = createContext<Readonly<RouteData>>(defaultActivatedRoute.data);
export const useRouteData = () => useContext(DataContext);

export const QueryContext = createContext<Readonly<RouteQuery>>(defaultActivatedRoute.query);
export const useRouteQuery = () => useContext(QueryContext);

export const ParamContext = createContext<Readonly<RouteParams>>(defaultActivatedRoute.params);
export const useRouteParams = () => useContext(ParamContext);

export const PathContext = createContext<string | undefined>(undefined);
export const useRoutePath = () => useContext(PathContext);

export const ActivatedRouteContext = createContext<Readonly<ActivatedRoute>>(defaultActivatedRoute);
export const useActivatedRoute = () => useContext(ActivatedRouteContext);

export const ActivatedRouteProvider: React.FC<Partial<ActivatedRoute>> = ({
  children,
  ...details
}) => {
  const parentActivatedRoute = useActivatedRoute();
  const activatedRoute = useMemo(
    () => defaults(details, parentActivatedRoute, defaultActivatedRoute),
    [details, parentActivatedRoute]
  );

  return (
    <PathContext.Provider value={activatedRoute.path}>
      <LoadingContext.Provider value={activatedRoute.loading}>
        <QueryContext.Provider value={activatedRoute.query}>
          <ParamContext.Provider value={activatedRoute.params}>
            <DataContext.Provider value={activatedRoute.data}>
              <ActivatedRouteContext.Provider value={activatedRoute}>
                {children}
              </ActivatedRouteContext.Provider>
            </DataContext.Provider>
          </ParamContext.Provider>
        </QueryContext.Provider>
      </LoadingContext.Provider>
    </PathContext.Provider>
  );
};
