import { InjectionToken, Injector } from '@brandingbrand/fslinker';
import { REACT } from './react.token';

export const useToken = <T>(token: InjectionToken<T>) => {
  const { useRef } = Injector.require(REACT);

  const ref = useRef<T>();

  if (ref.current === undefined) {
    ref.current = Injector.require(token);
  }

  return ref.current;
};
