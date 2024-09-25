import {useContext} from 'react';

import {DevMenuContext} from './context';

/**
 * Custom hook to access the DevMenu context state.
 *
 * This hook allows components to easily access the state provided by the `DevMenuContext.Provider`.
 * It is essential that this hook is used within a component wrapped by the `DevMenuContext.Provider`,
 * otherwise, it will throw an error.
 *
 * @returns {DevMenuContextType} The current state of the DevMenu context.
 * @throws Will throw an error if used outside of a `DevMenuContext.Provider`.
 */
export function useDevMenu() {
  // Retrieve the current state from the DevMenuContext
  const state = useContext(DevMenuContext);

  // Ensure that the hook is used within a DevMenuContext.Provider
  if (state == null) {
    throw new Error('useDevMenu must be used inside a DevMenuContext.Provider');
  }

  return state;
}
