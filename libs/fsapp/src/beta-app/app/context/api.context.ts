import { createContext } from 'react';

import { InjectionToken } from '@brandingbrand/fslinker';
import FSNetwork from '@brandingbrand/fsnetwork';

import { useDependencyContext } from '../../lib/use-dependency';

const DEFAULT_NETWORK = new FSNetwork();

export const APIContext = createContext<FSNetwork>(DEFAULT_NETWORK);
export const API_CONTEXT_TOKEN = new InjectionToken<typeof APIContext>('API_CONTEXT_TOKEN');

export const useAPI = (): FSNetwork => useDependencyContext(API_CONTEXT_TOKEN) ?? DEFAULT_NETWORK;
