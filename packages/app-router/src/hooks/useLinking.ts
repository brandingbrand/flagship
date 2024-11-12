import {useEffect} from 'react';
import {Linking} from 'react-native';
import urlParse from 'url-parse';

import {useNavigator} from './useNavigator';

/**
 * A custom hook that manages deep linking by listening for URL changes
 * and navigating accordingly using a navigator.
 *
 * @example
 * function App() {
 *   useLinking();
 *
 *   return <YourAppComponent />;
 * }
 *
 * // This hook will automatically handle incoming deep links and navigate
 * // based on the URL, such as `yourapp://path?query=param`.
 */
export function useLinking() {
  const navigator = useNavigator();

  /**
   * Handles the URL passed from deep linking and navigates to the correct screen.
   *
   * @param {Object} params - Parameters object.
   * @param {string | null} params.url - The URL to be processed.
   *
   * @example
   * callback({ url: 'yourapp://profile?user=123' });
   */
  function callback({url}: {url: string | null}) {
    if (!url) return;

    try {
      const {pathname, query} = urlParse(url);

      // Navigates to the parsed URL's pathname and search params
      navigator.open(pathname + query);
    } catch (e) {
      // Handle the error (e.g., log it)
    }
  }

  useEffect(() => {
    // Check the initial URL when the app is launched
    (async function () {
      try {
        const url = await Linking.getInitialURL();

        callback({url});
      } catch (e) {
        // Handle the error (e.g., log it)
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
