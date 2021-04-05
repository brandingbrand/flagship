import type { FSRouterHistory } from '../history';

import { createContext, useContext } from 'react';

import { dummyHistory } from '../history/history.dummy';

export const NavigatorContext = createContext<FSRouterHistory>(dummyHistory);
export const NavigatorProvider = NavigatorContext.Provider;
export const useNavigator = () => useContext(NavigatorContext);
