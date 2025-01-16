import {
  NavigationAction,
  createNavigationContainerRef,
} from '@react-navigation/native';

/**
 * Represents the result of a guard check.
 *
 * @property canActivate - Indicates whether navigation is allowed.
 * @property redirectTo - (Optional) The route to navigate to if navigation is blocked.
 * Can be a string path or a navigation object.
 */
export type GuardResult = {
  canActivate: boolean;
  redirectTo?: string | {name: string; params?: object};
};

/**
 * Represents a navigation guard function.
 *
 * This function checks whether navigation is allowed and returns a promise
 * resolving to a `GuardResult`.
 */
export type Guard = () => Promise<GuardResult>;

/**
 * Combines multiple guards into a single guard.
 *
 * The combined guard runs each guard in sequence. If any guard returns
 * `canActivate: false`, the combined guard immediately resolves to that result.
 *
 * @param guards - The guards to combine.
 * @returns A new guard that combines all the provided guards.
 *
 * @example
 * ```typescript
 * const guard1: Guard = async () => ({ canActivate: true });
 * const guard2: Guard = async () => ({ canActivate: false, redirectTo: '/login' });
 *
 * const combined = combineGuards(guard1, guard2);
 * const result = await combined();
 * console.log(result); // { canActivate: false, redirectTo: '/login' }
 * ```
 */
export const combineGuards = (...guards: Guard[]): Guard => {
  return async () => {
    for (const guard of guards) {
      const result = await guard();
      if (!result.canActivate) {
        return result;
      }
    }
    return {canActivate: true};
  };
};

/**
 * A navigation container reference to enable programmatic navigation.
 */
export const navigationRef = createNavigationContainerRef<any>();

/**
 * Overrides the dispatch method of the navigation container to intercept navigation actions
 * and dynamically evaluate guards.
 *
 * @param routeGuards - A mapping of route names to their corresponding guards.
 */
export function overrideNavigationDispatch(
  routeGuards: Record<string, Guard>,
): void {
  if (!navigationRef.current) {
    console.warn('Navigation reference is not ready.');
    return;
  }

  // Save the original dispatch method
  const originalDispatch = navigationRef.current.dispatch.bind(
    navigationRef.current,
  );

  // Override the dispatch method
  navigationRef.current.dispatch = async (action: NavigationAction) => {
    console.log('Intercepted navigation action:', action);

    // Check if the action is a NAVIGATE action
    if (action.type === 'NAVIGATE') {
      const targetRoute = (action.payload as any)?.params?.screen;

      if (targetRoute) {
        const guard = routeGuards[targetRoute];
        if (guard) {
          try {
            const result = await guard();

            if (!result.canActivate) {
              console.warn(`Navigation to ${targetRoute} is blocked.`);

              // Redirect if a redirectTo route is provided
              if (result.redirectTo) {
                if (typeof result.redirectTo === 'string') {
                  navigationRef.navigate(result.redirectTo);
                } else {
                  navigationRef.navigate(
                    result.redirectTo.name,
                    result.redirectTo.params,
                  );
                }
              }

              return; // Block the action
            }
          } catch (error) {
            console.error(
              `Error evaluating guard for route: ${targetRoute}`,
              error,
            );
            return; // Block navigation on guard error
          }
        }
      }
    }

    // Call the original dispatch method for allowed actions
    originalDispatch(action);
  };
}
