import type { AnyInjectionToken, InjectionToken } from '@brandingbrand/fslinker';
import { Injector } from '@brandingbrand/fslinker';

import { REACT_TOKEN } from './react.token';

const VERSION_NAMESPACE = /v\d+/i;

const isNamespaceInjectionToken = (key: AnyInjectionToken): boolean =>
  typeof key.uniqueKey === 'string' && VERSION_NAMESPACE.test(key.uniqueKey);

export const useVersionedToken = <T>(token: InjectionToken<T>): T => {
  const { useRef } = Injector.require(REACT_TOKEN);

  const ref = useRef<T>();

  if (ref.current === undefined) {
    for (const key of Injector.keys()) {
      if (isNamespaceInjectionToken(key)) {
        const namespaceInjector = Injector.require(key as InjectionToken<Injector>);
        const namespacedValue = namespaceInjector.get(token);

        if (namespacedValue !== undefined) {
          ref.current = namespacedValue;
          return ref.current;
        }
      }
    }

    ref.current = Injector.require(token);
  }

  return ref.current;
};
