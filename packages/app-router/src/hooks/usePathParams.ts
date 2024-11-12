import {match} from 'path-to-regexp';
import URLParse from 'url-parse';

import {useRoute} from './useRoute';

/**
 * Custom hook to retrieve URL parameters matched by the route's path.
 *
 * @returns {Partial<Record<string, string | string[]>>} An object containing the matched URL parameters.
 * @throws Will throw an error if no matches are found for the path parameters.
 *
 * @example
 * ```tsx
 * import { usePathParams } from 'path-to-hooks/usePathParams';
 *
 * function UserProfile() {
 *   const params = usePathParams();
 *   const userId = params.userId;
 *
 *   return (
 *     <div>
 *       <h1>User Profile</h1>
 *       <p>User ID: {userId}</p>
 *     </div>
 *   );
 * }
 *
 * // Assuming the route path is defined as `/user/:userId`
 * // If the current URL is `/user/123`, this component will display:
 * // User ID: 123
 * ```
 */
export function usePathParams(): Partial<Record<string, string | string[]>> {
  const route = useRoute();

  if (!route.url) return {};

  // Match the current URL pathname against the router's path pattern
  try {
    const {pathname} = URLParse(route.url, true);
    const matches = match(route.path)(pathname);

    if (!matches) {
      throw new Error('no matches for path params');
    }

    // Return the matched parameters
    return matches.params;
  } catch (e) {
    return {};
  }
}
