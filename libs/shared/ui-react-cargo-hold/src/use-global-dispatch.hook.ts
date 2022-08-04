import type { AnyAction } from '@brandingbrand/cargo-hold';
import { useReact } from '@brandingbrand/react-linker';

import { useGlobalStore } from './use-global-store.hook';

export const useGlobalDispatch = () => {
  const { useCallback } = useReact();
  const store = useGlobalStore();
  return useCallback(
    (action: AnyAction) => {
      store.dispatch(action);
    },
    [store]
  );
};
