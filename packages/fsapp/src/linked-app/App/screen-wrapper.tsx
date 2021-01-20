import type FSNetwork from '@brandingbrand/fsnetwork';
import type { Store } from 'redux';
import type { RouteComponentType } from '../types';

import { Provider } from 'react-redux';

import { APIContext } from '../context';

export interface Wrappers {
  store: Store;
  api: FSNetwork;
}

export const makeScreenWrapper = (wrappers: Wrappers) => (
  Component: RouteComponentType
): RouteComponentType => () => (
  <Provider store={wrappers.store}>
    <APIContext.Provider value={wrappers.api}>
      <Component />
    </APIContext.Provider>
  </Provider>
);
