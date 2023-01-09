import { useRef } from 'react';

import type { Observable } from 'rxjs';

import { useApp } from '../app';

export const useServerObservableState = (
  observable: Observable<unknown>,
  init: unknown
): unknown => {
  const app = useApp();
  const ref = useRef<unknown>();
  const lastObservable = useRef<unknown>();
  if (ref.current === undefined) {
    ref.current = init;
  }

  if (lastObservable.current !== observable) {
    const subscription = observable.subscribe({
      next: (value) => {
        ref.current = value;
      },
    });

    app?.addSubscription(subscription);
    lastObservable.current = observable;
  }

  return ref.current;
};
