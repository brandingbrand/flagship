import URLParse from 'url-parse';
import {match} from 'path-to-regexp';
import {Layout, Navigation, Options} from 'react-native-navigation';

import {ComponentIdContext, ModalContext} from '../context';
import type {ActionRoute, Guard, RouteMatchRoute} from '../types';

import {useComponentId} from './useComponentId';
import {useRoute} from './useRoute';

/**
 * Counter used for generating unique IDs.
 *
 * This variable keeps track of the last assigned ID and is incremented
 * each time a new ID is generated. It ensures that each generated ID
 * is unique within the current session or application lifecycle.
 *
 * @type {number}
 * @default 0
 */
let idCounter: number = 0;

/**
 * Custom hook to provide navigation functions for managing the component stack.
 *
 * This hook relies on `react-native-navigation` to navigate between screens. It includes methods
 * to push new screens onto the stack, pop screens off the stack, and set the root of the stack.
 *
 * @returns {object} An object containing navigation methods: `push`, `pop`, `popToRoot`, `popTo`, `setStackRoot`, and `showModal`.
 */
export function useNavigator() {
  const componentId = useComponentId();
  const route = useRoute();

  /**
   * Executes a series of guards to determine if navigation should be redirected or canceled.
   *
   * @param toPath - The destination path for navigation.
   * @param fromPath - The current path from which navigation is happening. If not provided, it defaults to `undefined`.
   * @param guards - An optional array of guard functions to be executed. Each guard is invoked with the destination path, current path, and control functions.
   *
   * @returns A promise that resolves to the redirect path if a guard calls `redirect`, or `undefined` if no redirection is needed.
   */
  async function runGuards(
    toPath: string,
    fromPath?: string | null,
    guards?: Guard[],
  ): Promise<string | false | undefined> {
    // If no guards are provided, exit early
    if (!guards) return;

    let redirectPath: string | false | undefined;

    /**
     * Cancels the navigation process by throwing an error.
     * This will halt the execution of the guards and propagate the error.
     */
    function cancel() {
      redirectPath = false;
    }

    /**
     * Sets the redirect path if navigation needs to be redirected.
     *
     * @param path - The path to redirect to.
     */
    function redirect(path: string) {
      redirectPath = path;
    }

    // Execute each guard in the order they are provided
    for (const guard of guards) {
      // If a redirect has been set, exit early and return the redirect path
      if (redirectPath !== undefined) {
        return redirectPath;
      }

      try {
        // Call the guard function with the parsed paths and control functions
        await guard(
          URLParse(toPath, true),
          fromPath ? URLParse(fromPath, true) : undefined,
          {cancel, redirect, showModal},
        );
      } catch (e) {
        throw new Error(`Guard error: ${(e as Error).message}`);
      }
    }

    // Return the redirect path if set, otherwise return `undefined`
    return redirectPath;
  }

  /**
   * Gets the index of a bottom tab for a given route.
   *
   * @param {Route} route - The route for which to get the bottom tab index.
   * @param {Route[]} routes - The array of all routes.
   * @returns {number} The index of the bottom tab.
   *
   * @example
   * const routes = [
   *   { name: 'Home', Component: HomeComponent, options: { bottomTab: { text: 'Home' } } },
   *   { name: 'Profile', Component: ProfileComponent, options: { bottomTab: { text: 'Profile' } } },
   * ];
   * const index = getBottomTabIndex(routes[1], routes);
   * console.log(index); // 1
   */
  function getBottomTabIndex(
    route: RouteMatchRoute,
    routes: RouteMatchRoute[],
  ): number {
    const index = routes
      .filter(it => it.type === 'bottomtab')
      .reduce((acc, curr, index) => {
        if (curr.name === route.name) {
          return index;
        }
        return acc;
      }, 0);

    return index;
  }

  /**
   * Opens a route based on the given path. If the route is associated with a bottom tab,
   * it pops to the root tab, otherwise, it pushes the new route.
   *
   * @param {string} path - The path to navigate to.
   * @param {Object} [passProps={}] - Optional properties to pass to the route.
   * @param {Options} [options] - Optional navigation options.
   *
   * @example
   * open('/profile', { userId: 123 }, { animated: true });
   *
   * @example
   * open('/home');
   */
  async function open(path: string, passProps = {}, options?: Options) {
    const url = URLParse(path, true);
    const matchedRoute = route.routes.find(it => match(it.path)(url.pathname));

    if (!matchedRoute) {
      throw new Error(`No route matched for path: ${path}`); // Throw error if route not found
    }

    try {
      const redirect = await runGuards(
        url.href,
        route.url ? URLParse(route.url, true).href : null,
        matchedRoute.guards,
      );

      if (redirect) return open(redirect, passProps, options);
      if (redirect === false) return;

      const res = match(matchedRoute.path)(url.pathname);
      const {query} = URLParse(url.href, true);

      if (matchedRoute.type === 'action') {
        await (matchedRoute as unknown as ActionRoute).action(
          url.href,
          res ? res.params : {},
          query,
        );
      }

      if (!matchedRoute.hasComponent) return;

      if (matchedRoute.type === 'bottomtab') {
        return popToRoot({
          ...options,
          bottomTabs: {
            currentTabIndex: getBottomTabIndex(matchedRoute, route.routes),
          },
        });
      }

      return push(path, passProps, options);
    } catch (e) {
      throw new Error(`Error during navigation: ${(e as Error).message}`);
    }
  }

  /**
   * Push a new screen onto the navigation stack.
   *
   * @param {string} path - The path or route name to navigate to.
   * @param {object} [passProps={}] - Optional props to pass to the new screen.
   * @param {Options} [options] - Optional navigation options for customizing the transition.
   */
  async function push(path: string, passProps = {}, options?: Options) {
    const matchedRoute = route.routes.find(it => {
      return match(it.path)(path);
    });

    if (!matchedRoute) return;

    if (matchedRoute.stackId) {
      Navigation.mergeOptions(componentId, {
        bottomTabs: {
          currentTabId: matchedRoute.stackId,
        },
      });
    }

    return Navigation.push(matchedRoute.stackId ?? componentId, {
      component: {
        name: matchedRoute.name,
        passProps: {
          ...passProps,
          APP_ROUTER_URL: path, // Inject the URL path as a special prop
        },
        options,
      },
    });
  }

  /**
   * Pop the current screen off the navigation stack, returning to the previous screen.
   *
   * @param {Options} [mergeOptions] - Optional navigation options for customizing the transition.
   */
  function pop(mergeOptions?: Options) {
    return Navigation.pop(componentId, mergeOptions);
  }

  /**
   * Pop all screens off the stack and return to the root screen.
   *
   * @param {Options} [mergeOptions] - Optional navigation options for customizing the transition.
   */
  function popToRoot(mergeOptions?: Options) {
    return Navigation.popToRoot(componentId, mergeOptions);
  }

  /**
   * Pop to a specific screen in the stack.
   *
   * @param {Options} [mergeOptions] - Optional navigation options for customizing the transition.
   */
  function popTo(mergeOptions?: Options) {
    return Navigation.popTo(componentId, mergeOptions);
  }

  /**
   * Set a new root for the stack, replacing all existing screens.
   *
   * @param {Layout | Layout[]} layout - The new layout or stack of layouts to set as the root.
   */
  function setStackRoot(layout: Layout | Layout[]) {
    return Navigation.setStackRoot(componentId, layout);
  }

  /**
   * Displays a modal with the specified React component and data, and returns a promise
   * that resolves when the modal is dismissed.
   *
   * @template T - The type of data passed to the modal component as props.
   * @template U - The type of data returned when the modal resolves (typically from `resolve`).
   *
   * @param Component - The React component to render inside the modal. This component must have an optional `modalId` property, which is assigned automatically if not provided.
   * @param data - The data of type `T` to pass as props to the modal component.
   * @param options - Additional modal display options, including animations, styles, and other navigation options.
   *
   * @returns A promise that resolves with the data of type `U` returned from the modal when it is dismissed or rejects if the modal is closed without a result.
   *
   * @throws Will throw an error if the modal component fails to register or display, or if an error occurs during dismissal.
   *
   * @example
   * ```typescript
   * interface MyComponentProps {
   *   prop1: string;
   * }
   * interface ResultType {
   *   resultKey: string;
   * }
   *
   * const result = await showModal<MyComponentProps, ResultType>(
   *   MyComponent,
   *   { prop1: 'value' },
   *   { modalOptions: { animated: true } }
   * );
   * console.log('Modal result:', result);
   * ```
   *
   * @remarks
   * - The function registers the `Component` with `Navigation` if it is not already registered by checking `modalId`.
   * - It uses `Navigation.showModal` to display the modal with the provided options and data, and wraps the component in `ModalContext` for handling resolution and rejection.
   * - Upon dismissal, the modal resolves or rejects based on user interaction or the component’s internal logic.
   */
  async function showModal<T, U>(
    Component: React.ComponentType & {modalId?: string},
    data: T,
    options: Options = {},
  ): Promise<U> {
    if (!Component.modalId) {
      Component.modalId = `Modal_${idCounter}`;
      idCounter++;

      try {
        Navigation.registerComponent(
          Component.modalId,
          () => props => {
            const {componentId, resolve, reject, ...passProps} = props;
            return (
              <ComponentIdContext.Provider value={componentId}>
                <ModalContext.Provider value={{resolve, reject}}>
                  <Component {...passProps} />
                </ModalContext.Provider>
              </ComponentIdContext.Provider>
            );
          },
          () => Component,
        );
      } catch (e) {
        throw new Error(
          `Error during modal registration: ${(e as Error).message}`,
        );
      }
    }

    return new Promise((res, rej) => {
      function resolve(componentId: string) {
        return (result: U) => {
          res(result);
          try {
            Navigation.dismissModal(componentId);
          } catch (e) {
            throw new Error(`Error dismissing modal: ${(e as Error).message}`);
          }
        };
      }

      function reject(componentId: string) {
        return () => {
          rej(new Error('Modal was rejected'));
          try {
            Navigation.dismissModal(componentId);
          } catch (e) {
            throw new Error(`Error dismissing modal: ${(e as Error).message}`);
          }
        };
      }

      if (!Component.modalId)
        throw Error(
          'Error showing modal: not tagged correctly with modalId or failed to register.',
        );

      try {
        Navigation.showModal({
          stack: {
            children: [
              {
                component: {
                  name: Component.modalId,
                  passProps: {
                    ...data,
                    resolve,
                    reject,
                  },
                  options: {
                    ...((Component as any).options ?? {}),
                    ...options,
                  },
                },
              },
            ],
          },
        });
      } catch (e) {
        throw new Error(`Error showing modal: ${(e as Error).message}`);
      }
    });
  }

  return {
    open,
    push,
    pop,
    popToRoot,
    popTo,
    setStackRoot,
    showModal,
  };
}
