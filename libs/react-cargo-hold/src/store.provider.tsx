import type { FC } from 'react';
import type { IStore } from '@brandingbrand/cargo-hold';

import { TokenProvider, useReact } from '@brandingbrand/react-linker';

import { StoreContext } from './store.context';
import { GlobalStoreContext } from './global-store.context';

export interface StoreProviderProps {
  store: IStore;
  // TODO: Make this refer to GlobalState, not any
  globalStore: IStore<any>;
}

export const StoreProvider: FC<StoreProviderProps> = ({ store, children }) => {
  const React = useReact();

  return (
    <TokenProvider token={GlobalStoreContext} value={store}>
      <TokenProvider token={StoreContext} value={store}>
        {children}
      </TokenProvider>
    </TokenProvider>
  );
};
