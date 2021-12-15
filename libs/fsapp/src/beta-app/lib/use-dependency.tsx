import React, { Context, createContext, useContext, useMemo } from 'react';
import { InjectionToken, Injector } from '@brandingbrand/fslinker';

const UNDEFINED_CONTEXT = createContext(undefined);

export const useDependency = <T,>(token: InjectionToken<T>) => {
  return useMemo(() => Injector.get(token), [token]);
};

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
  token,
  value,
  children,
}: InjectedContextProviderProps<T>) => {
  const Context = useDependency(token);
  return Context ? <Context.Provider value={value} children={children} /> : <>{children}</>;
};
