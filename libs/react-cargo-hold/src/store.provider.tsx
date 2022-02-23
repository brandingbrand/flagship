import type { IStore } from '@brandingbrand/cargo-hold';
import { TokenProvider, useReact } from '@brandingbrand/react-linker';
import type { FC } from 'react';
import { GlobalStoreContext } from './global-store.context';
import { StoreContext } from './store.context';

export interface StoreProviderProps {
  store: IStore;
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
