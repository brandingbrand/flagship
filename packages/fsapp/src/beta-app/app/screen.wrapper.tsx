import type { Store } from 'redux';
import type FSNetwork from '@brandingbrand/fsnetwork';
import type { IApp } from './types';

import React, { FC } from 'react';
import * as ReduxContext from 'react-redux';

import { APIContext, AppContext } from './context';

export interface Wrappers {
  readonly store?: Store<any, any>;
  readonly api?: FSNetwork;
  readonly app: () => IApp | undefined;
}

export const makeScreenWrapper = ({ api, app, store }: Wrappers): FC => {
  const App: React.FC = ({ children }) => <AppContext.Provider value={app} children={children} />;

  const Store: React.FC = store
    ? ({ children }) => <ReduxContext.Provider store={store} children={children} />
    : ({ children }) => <>{children}</>;

  const API: React.FC = api
    ? ({ children }) => <APIContext.Provider value={api} children={children} />
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
