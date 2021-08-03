import type { Store } from 'redux';
import type FSNetwork from '@brandingbrand/fsnetwork';
import type { IApp } from './types';

import React, { FC } from 'react';

import { InjectedContextProvider } from '../lib/use-dependency';
import { API_CONTEXT_TOKEN, APP_CONTEXT_TOKEN, InjectedReduxProvider } from './context';

export interface Wrappers {
  readonly store?: Store<any, any>;
  readonly api?: FSNetwork;
  readonly app: () => IApp | undefined;
}

export const makeScreenWrapper = ({ api, app, store }: Wrappers): FC => {
  const App: React.FC = ({ children }) => (
    <InjectedContextProvider token={APP_CONTEXT_TOKEN} value={app} children={children} />
  );

  const Store: React.FC = store
    ? ({ children }) => <InjectedReduxProvider store={store} children={children} />
    : ({ children }) => <>{children}</>;

  const API: React.FC = api
    ? ({ children }) => (
        <InjectedContextProvider token={API_CONTEXT_TOKEN} value={api} children={children} />
      )
    : ({ children }) => <>{children}</>;

  return ({ children }) => {
    return (
      <App>
        <Store>
          <API>{children}</API>
        </Store>
      </App>
    );
  };
};
