import type { Context } from 'react';
import React, { createContext, useContext, useMemo } from 'react';

import type { InjectionToken } from '@brandingbrand/fslinker';
import { Injector } from '@brandingbrand/fslinker';

const UNDEFINED_CONTEXT = createContext(undefined);

export const useDependency = <T,>(token: InjectionToken<T>) =>
  useMemo(() => Injector.get(token), [token]);

export const useDependencyContext = <T,>(token: InjectionToken<Context<T>>) => {
  const context = useMemo(() => Injector.get(token), [token]);
  return useContext((context ?? UNDEFINED_CONTEXT) as Context<T | undefined>);
};

export interface InjectedContextProviderProps<T> {
  token: InjectionToken<Context<T>>;
  value: T;
  children?: React.ReactNode;
}

export const InjectedContextProvider = <T,>({
  children,
  token,
  value,
}: InjectedContextProviderProps<T>) => {
  const Context = useDependency(token);
  return Context ? (
    <Context.Provider value={value}>{children}</Context.Provider>
  ) : (
    <React.Fragment>{children}</React.Fragment>
  );
};
