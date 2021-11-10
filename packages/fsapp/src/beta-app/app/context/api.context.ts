import { createContext } from 'react';
import FSNetwork from '@brandingbrand/fsnetwork';
import { InjectionToken } from '@brandingbrand/fslinker';

import { useDependencyContext } from '../../lib/use-dependency';

const DEFAULT_NETWORK = new FSNetwork();

export const APIContext = createContext<FSNetwork>(DEFAULT_NETWORK);
export const API_CONTEXT_TOKEN = new InjectionToken<typeof APIContext>('API_CONTEXT_TOKEN');

export const useAPI = () => useDependencyContext(API_CONTEXT_TOKEN) ?? DEFAULT_NETWORK;
