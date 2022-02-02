import type { Store } from '@brandingbrand/cargo-hold';

import { useReact } from '@brandingbrand/react-linker';
import { distinctUntilChanged, map } from 'rxjs/operators';

export const useStoreState = <State, Return = State>(
  store: Store<State>,
  mapState?: (state: State) => Return
) => {
  const { useLayoutEffect, useState } = useReact();
  const [state, setState] = useState<Return>(
    () => mapState?.(store.state) ?? (store.state as unknown as Return)
  );

  useLayoutEffect(() => {
    const subscription = store.state$
      .pipe(map(mapState ?? ((state) => state as unknown as Return)), distinctUntilChanged())
      .subscribe(setState);

    return () => subscription.unsubscribe();
  }, [store, setState]);

  return state;
};
