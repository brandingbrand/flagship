import type { IStore } from '@brandingbrand/cargo-hold';
import { useReact } from '@brandingbrand/react-linker';
import { distinctUntilChanged, map } from 'rxjs/operators';

export const useGlobalStoreState = <GlobalState, ReturnType>(
  store: IStore,
  mapState: (state: GlobalState) => ReturnType,
  dependencies: unknown[]
) => {
  const { useLayoutEffect, useState } = useReact();
  const [state, setState] = useState<ReturnType>(() => mapState(store.state));

  useLayoutEffect(() => {
    const subscription = store.state$
      .pipe(map(mapState), distinctUntilChanged())
      .subscribe(setState);

    return () => subscription.unsubscribe();
  }, [store, setState, ...dependencies]);

  return state;
};
