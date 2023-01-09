import { useCallback, useRef, useState } from 'react';

import type { Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

import { useApp } from '../app';

export const useHydratable = <T>(
  id: string,
  initialState: T,
  isInitiallyStable?: boolean
): [T, (value: T, stable: boolean) => void] => {
  const app = useApp();
  const isStableRef = useRef<Subject<boolean>>();
  const [state, setState] = useState<T>(() => app?.getInitialState(id) ?? initialState);

  if (isStableRef.current === undefined && app?.getInitialState(id) === undefined) {
    isStableRef.current = new BehaviorSubject(isInitiallyStable ?? false);
    app?.addStableDependency(id, isStableRef.current.asObservable());
  }

  const handleUpdate = useCallback(
    (value: T, isStable: boolean) => {
      setState(value);
      app?.setInitialState(id, value);
      isStableRef.current?.next(isStable);
    },
    [app, id]
  );

  return [state, handleUpdate];
};
