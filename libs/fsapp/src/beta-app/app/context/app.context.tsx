import { createContext, useMemo } from 'react';

import { InjectionToken } from '@brandingbrand/fslinker';

import { useDependencyContext } from '../../lib/use-dependency';
import type { IApp } from '../types';

export const AppContext = createContext<IApp | undefined>(undefined);
export const APP_CONTEXT_TOKEN = new InjectionToken<typeof AppContext>('APP_CONTEXT_TOKEN');

export const useApp = (): IApp | undefined => {
  const context = useDependencyContext(APP_CONTEXT_TOKEN);

  return useMemo(() => context, [context]);
};
