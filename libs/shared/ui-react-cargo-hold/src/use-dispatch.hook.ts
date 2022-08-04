import type { AnyAction } from '@brandingbrand/cargo-hold';
import { useReact } from '@brandingbrand/react-linker';

import { useStore } from './use-store.hook';

export const useDispatch = () => {
  const { useCallback } = useReact();
  const store = useStore();
  return useCallback(
    (action: AnyAction) => {
      store.dispatch(action);
    },
    [store]
  );
};
