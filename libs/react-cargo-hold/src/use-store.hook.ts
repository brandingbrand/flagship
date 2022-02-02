import { Store } from '@brandingbrand/cargo-hold';
import { useContextToken } from '@brandingbrand/react-linker';
import { StoreContext } from './store.context';

export const useStore = <T extends Store<{}>>() => {
  const store = useContextToken(StoreContext);

  if (__DEV__ && !store) {
    throw new Error(`${useStore.name} used outside of ${StoreContext.uniqueKey}`);
  }

  return store as T;
};
