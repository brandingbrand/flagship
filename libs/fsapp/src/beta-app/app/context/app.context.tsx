import type { IApp } from '../types';

import { createContext, useMemo } from 'react';
import { InjectionToken } from '@brandingbrand/fslinker';

import { useDependencyContext } from '../../lib/use-dependency';

export const AppContext = createContext<() => IApp | undefined>(() => undefined);
export const APP_CONTEXT_TOKEN = new InjectionToken<typeof AppContext>('APP_CONTEXT_TOKEN');

export const useApp = () => {
  const context = useDependencyContext(APP_CONTEXT_TOKEN);

  // tslint:disable-next-line: no-unnecessary-callback-wrapper -- Optional Chaining
  return useMemo(() => context?.(), [context]);
};
