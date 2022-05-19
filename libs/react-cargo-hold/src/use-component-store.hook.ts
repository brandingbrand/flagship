import { Store } from '@brandingbrand/cargo-hold';
import { useReact } from '@brandingbrand/react-linker';

export interface ComponentStoreOptions<T> {
  createInitialState: () => T;
  onInit?: (store: Store<T>) => void;
}

export const useComponentStore = <T extends {}>(options: ComponentStoreOptions<T>) => {
  const { useEffect, useRef } = useReact();
  const ref = useRef<Store<T>>();

  if (ref.current === undefined) {
    ref.current = new Store<T>(options.createInitialState());
    options.onInit?.(ref.current);
  }

  useEffect(() => () => ref.current?.dispose(), [ref]);

  return ref.current;
};
