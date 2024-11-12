import {useRoute} from './useRoute';

/**
 * Custom hook to retrieve the router data.
 *
 * @returns {T} The current router data.
 *
 * @example
 * ```tsx
 * import { useRouteData } from 'path-to-hooks/useRouteData';
 *
 * type RouteData = {
 *   userId: string;
 *   isAdmin: boolean;
 * };
 *
 * function UserProfile() {
 *   const data = useRouteData<RouteData>();
 *
 *   return (
 *     <div>
 *       <h1>User Profile</h1>
 *       <p>User ID: {data.userId}</p>
 *       <p>Admin Status: {data.isAdmin ? 'Yes' : 'No'}</p>
 *     </div>
 *   );
 * }
 *
 * // Assuming the route's data includes { userId: '123', isAdmin: true }
 * // This component will display:
 * // User ID: 123
 * // Admin Status: Yes
 * ```
 */
export function useRouteData<T>(): T {
  const route = useRoute();

  return route.data as T;
}
