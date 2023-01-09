import type { FC } from 'react';
import React, { useRef } from 'react';

import type { IStore as CargoHoldStore } from '@brandingbrand/cargo-hold';
import { Injector } from '@brandingbrand/fslinker';
import type FSNetwork from '@brandingbrand/fsnetwork';

import type { Store } from 'redux';

import { InjectedContextProvider } from '../lib/use-dependency';

import { API_TOKEN, APP_TOKEN } from './app';
import { API_CONTEXT_TOKEN, APP_CONTEXT_TOKEN, InjectedReduxProvider } from './context';
import type { IApp } from './types';

export interface Wrappers {
  readonly cargoHold?: CargoHoldStore;
  readonly store?: Store<any, any>;
  readonly provider?: FC;
}

export const makeScreenWrapper = async ({
  store,
  cargoHold,
  provider: Provider = React.Fragment,
}: Wrappers): Promise<FC> => {
  const { StoreProvider } = await import('@brandingbrand/react-cargo-hold');

  const CargoHold: React.FC = cargoHold
    ? ({ children }) => <StoreProvider store={cargoHold}>{children}</StoreProvider>
    : ({ children }) => <React.Fragment>{children}</React.Fragment>;

  const Store: React.FC = store
    ? ({ children }) => <InjectedReduxProvider store={store}>{children}</InjectedReduxProvider>
    : ({ children }) => <React.Fragment>{children}</React.Fragment>;

  const App: React.FC = ({ children }) => {
    const app = useRef<IApp>();
    if (app.current === undefined) {
      app.current = Injector.require(APP_TOKEN);
    }

    return (
      <InjectedContextProvider token={APP_CONTEXT_TOKEN} value={app.current}>
        {children}
      </InjectedContextProvider>
    );
  };

  const API: React.FC = ({ children }) => {
    const api = useRef<FSNetwork>();
    if (api.current === undefined) {
      api.current = Injector.get(API_TOKEN);
    }

    if (api.current) {
      return (
        <InjectedContextProvider token={API_CONTEXT_TOKEN} value={api.current}>
          {children}
        </InjectedContextProvider>
      );
    }

    return <React.Fragment>{children}</React.Fragment>;
  };

  return ({ children }) => (
    <App>
      <CargoHold>
        <Store>
          <API>
            <Provider>{children}</Provider>
          </API>
        </Store>
      </CargoHold>
    </App>
  );
};
