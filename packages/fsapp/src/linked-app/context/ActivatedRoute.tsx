import { defaults } from 'lodash-es';
import React, { createContext, useContext } from 'react';

import { ActivatedRoute, RouteData, RouteParams, RouteQuery } from '../types';

export const LoadingContext = createContext<boolean>(false);
export const useRouteLoading = () => useContext(LoadingContext);

export const DataContext = createContext<RouteData>({});
export const useRouteData = () => useContext(DataContext);

export const ParamContext = createContext<RouteParams>({});
export const useRouteParams = () => useContext(ParamContext);

export const QueryContext = createContext<RouteQuery>({});
export const useRouteQuery = () => useContext(QueryContext);

export const ActivatedRouteContext = createContext<ActivatedRoute | undefined>(undefined);
export const useActivatedRoute = () => useContext(ActivatedRouteContext);

export const ActivatedRouteProvider: React.FC<Partial<ActivatedRoute>> = ({
  children,
  ...details
}) => {
  const activatedRoute = defaults(details, {
    loading: false,
    query: {},
    params: {},
    data: {}
  });

  return (
    <LoadingContext.Provider value={activatedRoute.loading}>
      <QueryContext.Provider value={activatedRoute.query}>
        <ParamContext.Provider value={activatedRoute.params}>
          <DataContext.Provider value={activatedRoute.data}>
            <ActivatedRouteContext.Provider value={navigator ? activatedRoute : undefined}>
              {children}
            </ActivatedRouteContext.Provider>
          </DataContext.Provider>
        </ParamContext.Provider>
      </QueryContext.Provider>
    </LoadingContext.Provider>
  );
};
