import { ActionCreator } from '@brandingbrand/cargo-hold';
import { useReact } from '@brandingbrand/react-linker';

import { useStore } from './use-store.hook';

export const useActionCreator = <
  Type extends string,
  Subtype extends string | undefined,
  Payload,
  Params extends unknown[]
>(
  actionCreator: ActionCreator<Type, Subtype, Payload, Params>
) => {
  const { useCallback } = useReact();
  const store = useStore();
  return useCallback(
    (...params: Params) => {
      store.dispatch(actionCreator.create(...params));
    },
    [store, actionCreator]
  );
};
