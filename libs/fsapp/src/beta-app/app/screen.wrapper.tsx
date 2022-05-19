import type { FC } from 'react';
import React, { Fragment } from 'react';

import type FSNetwork from '@brandingbrand/fsnetwork';

import type { Store } from 'redux';

import { InjectedContextProvider } from '../lib/use-dependency';

import { API_CONTEXT_TOKEN, APP_CONTEXT_TOKEN, InjectedReduxProvider } from './context';
import type { IApp } from './types';

export interface Wrappers {
  readonly store?: Store;
  readonly api?: FSNetwork;
  readonly app: () => IApp | undefined;
  readonly provider?: FC;
}

export const makeScreenWrapper = ({
  api,
  app,
  store,
  provider: Provider = Fragment,
}: Wrappers): FC => {
  const App: React.FC = ({ children }) => (
    <InjectedContextProvider token={APP_CONTEXT_TOKEN} value={app}>
      {children}
    </InjectedContextProvider>
  );

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
      <Store>
        <API>
          <Provider>{children}</Provider>
        </API>
      </Store>
    </App>
  );
};
