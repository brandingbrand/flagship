import type { IApp } from '../types';

import { createContext, useContext, useMemo } from 'react';

export const AppContext = createContext<() => IApp | undefined>(() => undefined);
export const useApp = () => {
  const context = useContext(AppContext);
  return useMemo(context, []);
};
