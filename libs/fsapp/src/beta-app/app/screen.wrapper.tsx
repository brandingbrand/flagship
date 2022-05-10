import type { FC } from 'react';
import React from 'react';

import type { IStore as CargoHoldStore } from '@brandingbrand/cargo-hold';
import type FSNetwork from '@brandingbrand/fsnetwork';

import type { Store } from 'redux';

import { InjectedContextProvider } from '../lib/use-dependency';

import { API_CONTEXT_TOKEN, APP_CONTEXT_TOKEN, InjectedReduxProvider } from './context';
import type { IApp } from './types';

export interface Wrappers {
  readonly cargoHold?: CargoHoldStore;
  readonly store?: Store<any, any>;
  readonly api?: FSNetwork;
  readonly app: () => IApp | undefined;
  readonly provider?: FC;
}

export const makeScreenWrapper = async ({
  api,
  app,
  store,
  cargoHold,
  provider: Provider = React.Fragment,
}: Wrappers): Promise<FC> => {
  const { StoreProvider } = await import('@brandingbrand/react-cargo-hold');

  const App: React.FC = ({ children }) => (
    <InjectedContextProvider token={APP_CONTEXT_TOKEN} value={app}>
      {children}
    </InjectedContextProvider>
  );

  const CargoHold: React.FC = cargoHold
    ? ({ children }) => <StoreProvider store={cargoHold}>{children}</StoreProvider>
    : ({ children }) => <React.Fragment>{children}</React.Fragment>;

  const Store: React.FC = store
    ? ({ children }) => <InjectedReduxProvider store={store}>{children}</InjectedReduxProvider>
    : ({ children }) => <React.Fragment>{children}</React.Fragment>;

  const API: React.FC = api
    ? ({ children }) => (
        <InjectedContextProvider token={API_CONTEXT_TOKEN} value={api}>
          {children}
        </InjectedContextProvider>
      )
    : ({ children }) => <React.Fragment>{children}</React.Fragment>;

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
