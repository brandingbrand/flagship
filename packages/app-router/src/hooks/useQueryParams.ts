import URLParse from 'url-parse';

import {useRoute} from './useRoute';

/**
 * Custom hook to retrieve search parameters from the URL.
 *
 * @returns {Partial<Record<string, string | string[]>>} An object containing key-value pairs of search parameters.
 *
 * @example
 * ```tsx
 * import { useQueryParams } from 'path-to-hooks/useQueryParams';
 *
 * function SearchResults() {
 *   const queryParams = useQueryParams();
 *   const searchTerm = queryParams.q;
 *   const page = queryParams.page;
 *
 *   return (
 *     <div>
 *       <h1>Search Results</h1>
 *       <p>Search Term: {searchTerm}</p>
 *       <p>Page: {page}</p>
 *     </div>
 *   );
 * }
 *
 * // Assuming the current URL is `/search?q=books&page=2`
 * // This component will display:
 * // Search Term: books
 * // Page: 2
 * ```
 */
export function useQueryParams(): Partial<Record<string, string | string[]>> {
  const route = useRoute();

  if (!route.url) return {};

  const {query} = URLParse(route.url, true);

  return query;
}
