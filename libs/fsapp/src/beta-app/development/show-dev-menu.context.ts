import { createContext } from 'react';
import { shouldShowDevMenu } from './utils';

export const IsDevMenuShown = createContext(shouldShowDevMenu());
export const ToggleDevMenu = createContext(() => {});
