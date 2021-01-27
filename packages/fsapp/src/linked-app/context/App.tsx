import { createContext, useContext } from 'react';
import { AppType } from '../App';

export const AppContext = createContext<(() => AppType | undefined)>(() => undefined);
export const useApp = () => useContext(AppContext)();
