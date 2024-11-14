import {useEffect} from 'react';
import {Linking} from 'react-native';
import urlParse from 'url-parse';

import {useNavigator} from './useNavigator';

/**
 * A custom hook that manages deep linking by listening for URL changes
 * and navigating accordingly using a navigator.
 *
 * @param {string[]} hosts - An array of valid hostnames to match against the incoming URL.
 * Only URLs with these hosts will be parsed; otherwise, the URL will be navigated directly.
 * @param {(e: Error) => void} [onError] - Optional error handler invoked if URL parsing or navigation fails.
 *
 * @example
 * function App() {
 *   useLinking(['app'], (e) => console.error(e));
 *
 *   return <YourAppComponent />;
 * }
 *
 * @remarks
 * This hook relies on the provided `hosts` to determine if the host component of a URL
 * should be trusted as valid. Due to how `url-parse` handles URLs, segments of a path may be
 * parsed as the host. For instance, in `yourapp://app/path`, `url-parse` will interpret `app`
 * as the host. This behavior may lead to ambiguity, as `app` could be intended as part of the path
 * rather than the host. By specifying `hosts`, the hook can validate the host component and ensure
 * that only recognized hosts are parsed, improving navigation accuracy.
 */
export function useLinking(hosts: string[] = [], onError?: (e: Error) => void) {
  const navigator = useNavigator();

  /**
   * Processes the provided URL and navigates to the corresponding screen.
   *
   * @param {Object} params - The parameters for URL handling.
   * @param {string | null} params.url - The URL to be processed and navigated to, if applicable.
   *
   * @example
   * callback({ url: 'yourapp://profile?user=123' });
   *
   * @remarks
   * This function checks if the provided `url`'s host is within the specified `hosts`.
   * If the host is included, it navigates directly to the `pathname` and `query` parameters of the URL.
   * Otherwise, it prepends the host to the `pathname` and `query`, allowing for flexible navigation handling.
   */
  function callback({url}: {url: string | null}) {
    if (!url) return;

    try {
      const {host, pathname, query} = urlParse(url);

      if (hosts.includes(host)) {
        // Navigates to the parsed URL's pathname and query parameters if the host is recognized
        navigator.open(pathname + query);
      } else {
        // If no hosts are specified, navigate using the full URL structure as a fallback
        navigator.open(`/${host}${pathname}${query}`);
      }
    } catch (e) {
      onError?.(e as Error);
    }
  }

  useEffect(() => {
    // Check the initial URL when the app is launched
    (async function () {
      try {
        const url = await Linking.getInitialURL();
        callback({url});
      } catch (e) {
        onError?.(e as Error);
      }
    })();

    // Listen for any URL events and handle them with the callback
    const subscription = Linking.addEventListener('url', callback);

    // Cleanup the event listener when the component unmounts
    return () => {
      subscription.remove();
    };
  }, []);
}
