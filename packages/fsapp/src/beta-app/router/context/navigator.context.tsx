import type { FSRouterHistory } from '../history';

import React, { createContext, FC } from 'react';
import { InjectionToken, Injector } from '@brandingbrand/fslinker';

import { dummyHistory } from '../history/history.dummy';
import { InjectedContextProvider } from '../../lib/use-dependency';

export const NAVIGATOR_TOKEN = new InjectionToken<FSRouterHistory>('NAVIGATOR');

export const NavigatorContext = createContext<FSRouterHistory>(dummyHistory);
export const NAVIGATOR_CONTEXT_TOKEN = new InjectionToken<typeof NavigatorContext>(
  'NAVIGATOR_CONTEXT_TOKEN'
);

export const useNavigator = () => {
  const ref = React.useRef<FSRouterHistory>();

  if (!ref.current) {
    ref.current = Injector.require(NAVIGATOR_TOKEN);
  }

  return ref.current;
};

export interface NavigatorProviderProps {
  value: FSRouterHistory;
}
export const NavigatorProvider: FC<NavigatorProviderProps> = ({ value, children }) => (
  <InjectedContextProvider token={NAVIGATOR_CONTEXT_TOKEN} value={value} children={children} />
);
