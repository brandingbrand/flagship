import type { InjectionToken } from '@brandingbrand/fslinker';
import { Injector } from '@brandingbrand/fslinker';

import { REACT_TOKEN } from './react.token';

export const useToken = <T>(token: InjectionToken<T>) => {
  const { useRef } = Injector.require(REACT_TOKEN);

  const ref = useRef<T>();

  if (ref.current === undefined) {
    ref.current = Injector.require(token);
  }

  return ref.current;
};
