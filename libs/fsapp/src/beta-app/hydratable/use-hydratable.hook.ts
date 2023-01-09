import { useState } from 'react';

import { useApp } from '../app';

export const useHydratable = <T>(
  id: string,
  initialState: T,
  _isInitiallyStable?: boolean
): [T, (value: T, stable: boolean) => void] => {
  const app = useApp();
  const [state, setState] = useState<T>(() => app?.getInitialState(id) ?? initialState);

  return [state, setState];
};
