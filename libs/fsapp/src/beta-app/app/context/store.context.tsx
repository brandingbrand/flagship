import type { FC } from 'react';
import React from 'react';

import type { ProviderProps, ReactReduxContext, ReactReduxContextValue } from 'react-redux';
import { Provider } from 'react-redux';

import { InjectionToken } from '@brandingbrand/fslinker';

import type { Action, AnyAction, Store } from 'redux';

import { useDependency, useDependencyContext } from '../../lib/use-dependency';

export const REDUX_CONTEXT_TOKEN = new InjectionToken<typeof ReactReduxContext>(
  'REDUX_CONTEXT_TOKEN'
);

export const REDUX_STORE_TOKEN = new InjectionToken<Store>('REDUX_STORE_TOKEN');

export const InjectedReduxProvider: FC<Partial<Omit<ProviderProps, 'context'>>> = ({
  children,
  store,
}) => {
  const context = useDependency(REDUX_CONTEXT_TOKEN);
  return context && store ? (
    <Provider context={context} store={store}>
      {children}
    </Provider>
  ) : (
    <React.Fragment>{children}</React.Fragment>
  );
};

const useRedux = <S, A extends Action = AnyAction>(): ReactReduxContextValue<S, A> | undefined =>
  useDependencyContext(REDUX_CONTEXT_TOKEN) as ReactReduxContextValue<S, A> | undefined;

export const useStore = <T, A extends Action = AnyAction>() => useRedux<T, A>()?.store;

export const useDispatch = <A extends Action = AnyAction>() =>
  useRedux<unknown, A>()?.store.dispatch;
