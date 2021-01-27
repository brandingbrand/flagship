import type { RouterHistory } from '../History';

import { createContext, useContext } from 'react';

export const NavigatorContext = createContext<RouterHistory | undefined>(undefined);
export const NavigatorProvider = NavigatorContext.Provider;
export const useNavigator = () => useContext(NavigatorContext);

