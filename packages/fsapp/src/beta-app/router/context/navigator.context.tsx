import type { FSRouterHistory } from '../history';

import React, { createContext, FC } from 'react';
import { InjectionToken } from '@brandingbrand/fslinker';

import { dummyHistory } from '../history/history.dummy';
import { InjectedContextProvider, useDependencyContext } from '../../lib/use-dependency';

export const NavigatorContext = createContext<FSRouterHistory>(dummyHistory);
export const NAVIGATOR_CONTEXT_TOKEN = new InjectionToken<typeof NavigatorContext>(
  'NAVIGATOR_CONTEXT_TOKEN'
);
export const useNavigator = () => useDependencyContext(NAVIGATOR_CONTEXT_TOKEN) ?? dummyHistory;

export interface NavigatorProviderProps {
  value: FSRouterHistory;
}
export const NavigatorProvider: FC<NavigatorProviderProps> = ({ value, children }) => (
  <InjectedContextProvider token={NAVIGATOR_CONTEXT_TOKEN} value={value} children={children} />
);
