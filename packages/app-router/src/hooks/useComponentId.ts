import {useContext} from 'react';

import {ComponentIdContext} from '../context';

/**
 * Custom hook to access the Component ID context.
 *
 * @returns {string} The current component ID from the ComponentIdContext.
 * @throws Will throw an error if the hook is used outside of a ComponentIdContext.Provider.
 *
 * @example
 * ```tsx
 * import { useComponentId } from 'path-to-hooks/useComponentId';
 *
 * function MyComponent() {
 *   const componentId = useComponentId();
 *
 *   return (
 *     <div>
 *       <p>Component ID: {componentId}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function useComponentId(): string {
  const state = useContext(ComponentIdContext);

  if (!state) {
    throw new Error(
      'useComponentId must be used within a ComponentIdContext.Provider',
    );
  }

  return state;
}
