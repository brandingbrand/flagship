import type FSNetwork from '@brandingbrand/fsnetwork';
import type { Store } from 'redux';
import type { RouteComponentType } from '../types';
import type { App } from './types';

import React from 'react';
import * as ReduxContext from 'react-redux';
import { APIContext, AppContext } from '../context';

export interface Wrappers {
  store?: Store;
  api?: FSNetwork;
  app: () => App | undefined;
}

export const makeScreenWrapper = ({ api, app, store }: Wrappers) => {
  const App: React.FC = ({ children }) => <AppContext.Provider value={app} children={children} />;

  const Store: React.FC = store
    ? ({ children }) => <ReduxContext.Provider store={store} children={children} />
    : ({ children }) => <>{children}</>;

  const API: React.FC = api
    ? ({ children }) => <APIContext.Provider value={api} children={children} />
    : ({ children }) => <>{children}</>;


  return (Component: RouteComponentType): RouteComponentType => () => {
    return (
      <App>
        <Store>
          <API>
            <Component />
          </API>
        </Store>
      </App>
    );
  };
};
