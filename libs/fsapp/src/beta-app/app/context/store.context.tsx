import React, { FC } from 'react';
import { Action, AnyAction, Store } from 'redux';
import { Provider, ProviderProps, ReactReduxContext, ReactReduxContextValue } from 'react-redux';
import { InjectionToken } from '@brandingbrand/fslinker';

import { useDependency, useDependencyContext } from '../../lib/use-dependency';

export const REDUX_CONTEXT_TOKEN = new InjectionToken<typeof ReactReduxContext>(
  'REDUX_CONTEXT_TOKEN'
);

export const REDUX_STORE_TOKEN = new InjectionToken<Store>('REDUX_STORE_TOKEN');

export const InjectedReduxProvider: FC<Partial<Omit<ProviderProps, 'context'>>> = ({
  store,
  children,
}) => {
  const context = useDependency(REDUX_CONTEXT_TOKEN);
  return context && store ? (
    <Provider store={store} context={context} children={children} />
  ) : (
    <>{children}</>
  );
};

const useRedux = <S, A extends Action = AnyAction>(): ReactReduxContextValue<S, A> | undefined => {
  return useDependencyContext(REDUX_CONTEXT_TOKEN) as ReactReduxContextValue<S, A> | undefined;
};

export const useStore = <T, A extends Action = AnyAction>() => {
  return useRedux<T, A>()?.store;
};

export const useDispatch = <A extends Action = AnyAction>() => {
  return useRedux<unknown, A>()?.store.dispatch;
};
