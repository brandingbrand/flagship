import type { FC } from 'react';
import type { IStore } from '@brandingbrand/cargo-hold';

import { TokenProvider, useReact } from '@brandingbrand/react-linker';

import { StoreContext } from './store.context';
import { useStore } from './use-store.hook';

export interface NestedStoreProviderProps {
  tag: symbol;
  store: IStore;
}

export const NestedStoreProvider: FC<NestedStoreProviderProps> = ({ tag, store, children }) => {
  const React = useReact();
  const parentStore = useStore();

  React.useEffect(() => {
    // This will propagate actions up to the root store
    const subscription = store.action$.subscribe((action) => {
      parentStore.dispatch({
        ...action,
        source: tag,
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [store, parentStore]);

  return (
    <TokenProvider token={StoreContext} value={store}>
      {children}
    </TokenProvider>
  );
};
