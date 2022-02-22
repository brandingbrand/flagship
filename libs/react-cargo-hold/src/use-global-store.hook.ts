import { Store } from '@brandingbrand/cargo-hold';
import { useContextToken } from '@brandingbrand/react-linker';
import { GlobalStoreContext } from './global-store.context';

export const useGlobalStore = <T extends Store<{}>>() => {
  const store = useContextToken(GlobalStoreContext);

  if (__DEV__ && !store) {
    throw new Error(`${useGlobalStore.name} used outside of ${GlobalStoreContext.uniqueKey}`);
  }

  return store as T;
};
