import { ActionCreator } from '@brandingbrand/cargo-hold';
import { useReact } from '@brandingbrand/react-linker';

import { useGlobalStore } from './use-global-store.hook';

export const useGlobalActionCreator = <
  Type extends string,
  Subtype extends string | undefined,
  Payload,
  Params extends unknown[]
>(
  actionCreator?: ActionCreator<Type, Subtype, Payload, Params>
) => {
  const { useCallback } = useReact();
  const store = useGlobalStore();
  return useCallback(
    (...params: Params) => {
      if (actionCreator) {
        store.dispatch(actionCreator.create(...params));
      }
    },
    [store, actionCreator]
  );
};
