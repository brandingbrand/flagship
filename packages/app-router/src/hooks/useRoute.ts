import {useContext} from 'react';

import {RouteContext} from '../context';
import type {RouteMatch} from '../types';

/**
 * Custom hook to access the Router context.
 *
 * @returns {RouteMatch} The current router state from the RouterContext.
 * @throws Will throw an error if the hook is used outside of a RouterContext.Provider.
 *
 * @example
 * ```tsx
 * import { useRoute } from 'path-to-hooks/useRoute';
 *
 * function MyComponent() {
 *   const route = useRoute();
 *
 *   return (
 *     <div>
 *       <h1>Current Route</h1>
 *       <pre>{JSON.stringify(route, null, 2)}</pre>
 *     </div>
 *   );
 * }
 * ```
 */
export function useRoute(): RouteMatch {
  const state = useContext(RouteContext);

  if (!state) {
    throw new Error('useRoute must be used within a RouteContext.Provider.');
  }

  return state;
}
