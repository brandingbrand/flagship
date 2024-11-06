import {
  LayoutRoot,
  LayoutStack,
  Navigation,
  OptionsBottomTab,
} from 'react-native-navigation';
import {Fragment} from 'react';

import {ComponentIdContext, RouteContext} from './context';
import {
  BottomTabRoute,
  ComponentRoute,
  RouteChild,
  RouteChildWithoutChildren,
  Router,
} from './types';

/**
 * Flattens a nested array of route objects into a flat array while preserving the `stackId`
 * of parent routes and associating it with their child routes.
 *
 * @param {(RootRouteObject | RouteObject)[]} routes - The array of route objects to flatten.
 * The array can contain both `RootRouteObject` and `RouteObject`, which may have children.
 *
 * @param {string} [parentStackId] - An optional `stackId` passed from a parent route. If present,
 * the `stackId` will be assigned to child routes unless the child route explicitly defines its own `stackId`.
 *
 * @returns {Omit<RouteObject, 'children'>[]} A flat array of route objects without the `children` property,
 * each with the appropriate `stackId` inherited from parent routes when necessary.
 *
 * @remarks
 * This function works recursively, ensuring that any nested routes are flattened into a single-level array.
 * The `stackId` is passed down the route hierarchy, so that child routes inherit the `stackId` from their parent
 * if they don't define their own. Routes are represented without their `children` property after flattening.
 *
 * @example
 * const routes: RouteObject[] = [
 *   {
 *     name: 'Home',
 *     path: '/',
 *     Component: HomeComponent,
 *     children: [
 *       {
 *         name: 'Profile',
 *         path: '/profile',
 *         Component: ProfileComponent,
 *         stackId: 'mainStack',
 *       },
 *     ],
 *   },
 * ];
 *
 * const flattened = flatten(routes);
 *
 * // Output:
 * // [
 * //   { name: 'Home', path: '/', Component: HomeComponent },
 * //   { name: 'Profile', path: '/profile', Component: ProfileComponent, stackId: 'mainStack' }
 * // ]
 */
function flatten(
  routes: (BottomTabRoute | RouteChild)[],
  parentStackId?: string,
): RouteChildWithoutChildren[] {
  return routes.flatMap(route => {
    // Extract children and the rest of the route properties
    const {children, ...routeProps} = route;

    const currentStackId =
      route.type === 'bottomtab' ? route.stackId : parentStackId;

    // Create the flattened current route without children
    const flattenedRoute = {...routeProps, stackId: currentStackId};

    // Recursively flatten child routes
    const flattenedChildren = flatten(children || [], currentStackId);

    return [flattenedRoute, ...flattenedChildren];
  });
}

/**
 * Sets the root layout for the application and registers the app launch listener.
 *
 * @param {LayoutRoot} layout - The current layout object.
 * @param {Route[]} routes - Array of route definitions.
 * @param {Function} [onAppLaunched] - Optional callback to be called after the app is launched.
 * @param {Function} [setRoot] - Optional callback to be called when root should be set.
 *
 * @example
 * setRootLayout(layout, routes, async () => {
 *   console.log('App launched');
 * });
 */
function setRootLayout(
  layout: LayoutRoot,
  routes: RouteChildWithoutChildren[],
  onAppLaunched?: () => Promise<void>,
  setRoot?: (layout: LayoutRoot) => Promise<void>,
): void {
  // If no layout has been defined, set a default stack layout with the first route
  if (!Object.keys(layout.root).length) {
    layout.root = {
      stack: {
        children: [
          {
            component: {
              name: routes[0]?.name!,
            },
          },
        ],
      },
    };
  }

  // Register the app launched listener to set the root layout
  Navigation.events().registerAppLaunchedListener(async () => {
    try {
      await onAppLaunched?.();
    } catch {
      // handle the error (e.g., log it)
    }

    if (setRoot) return setRoot(layout);

    Navigation.setRoot(layout);
  });
}

/**
 * Adds a bottom tab to the root layout.
 *
 * @param {LayoutRoot} layout - The current layout object.
 * @param {string} routeName - The name of the route associated with the bottom tab.
 * @param {OptionsBottomTab} bottomTab - The bottom tab configuration.
 * @param {string} stackId - Unique identifier for a stack within the navigation hierarchy.
 *
 * @example
 * addBottomTabToLayout(layout, 'HomeScreen', { text: 'Home' });
 */
function addBottomTabToLayout(
  layout: LayoutRoot,
  routeName: string,
  bottomTab: OptionsBottomTab,
  stackId?: string,
) {
  const tab: LayoutStack = {
    id: stackId,
    children: [
      {
        component: {
          name: routeName,
        },
      },
    ],
    options: {
      bottomTab,
    },
  };

  // Update the layout to include the new bottom tab
  layout.root = {
    bottomTabs: {
      children: [...(layout.root.bottomTabs?.children ?? []), {stack: tab}],
    },
  };
}

/**
 * Renders a specified route component, wrapping it with an error boundary, a provider, and context providers
 * for route and component identifiers.
 *
 * This function sanitizes the routes array to create a lighter context object, removing the `Component` and
 * `ErrorBoundary` properties and adding a `hasComponent` flag to indicate the presence of a component.
 * It then wraps the route's `Component` in a series of providers, including an `ErrorBoundary` for handling
 * any runtime errors, a `Provider` for custom context, and the route-specific contexts.
 *
 * @param {ComponentRoute | BottomTabRoute} route - The route object to render, which includes
 * the component to be displayed, route path, name, and any navigation options.
 * @param {Record<string, unknown> & { componentId: string; APP_ROUTER_URL: string }} props - Props passed to the component,
 * including `componentId` for the navigation stack and `APP_ROUTER_URL` for the current route URL.
 * @param {React.ComponentType<any>} Provider - A React component to wrap the route component with custom context,
 * allowing for dependency injection or state management specific to this navigation structure.
 * @param {React.ComponentType<any>} ErrorBoundary - A React component for error handling, wrapping the component
 * to catch any errors that occur during rendering or lifecycle events.
 * @param {RouteChildWithoutChildren[]} routes - An array of sanitized route objects representing available routes.
 * Each route object is stripped of its `Component` and `ErrorBoundary` properties for a leaner context object.
 *
 * @returns {JSX.Element} The rendered route component, wrapped with the specified error boundary, provider,
 * and context providers to manage navigation and route data.
 *
 * @example
 * const renderedComponent = renderComponent(
 *   { path: '/home', name: 'HomeScreen', Component: HomeComponent },
 *   { componentId: 'component1', APP_ROUTER_URL: 'https://example.com' },
 *   MyCustomProvider,
 *   MyErrorBoundary,
 *   routes
 * );
 */
function renderComponent(
  route: ComponentRoute | BottomTabRoute,
  props: Record<string, unknown> & {
    componentId: string;
    APP_ROUTER_URL: string;
  },
  Provider: React.ComponentType<any>,
  ErrorBoundary: React.ComponentType<any>,
  routes: RouteChildWithoutChildren[],
) {
  const {componentId, APP_ROUTER_URL, ...data} = props;
  const {Component} = route;

  /**
   * Sanitizes the routes by removing `Component` and `ErrorBoundary` from the context.
   * This is done to make the context lighter, as we only need to know whether a component
   * exists, not store the entire component itself.
   *
   * @param routes - The array of route objects to sanitize.
   * @returns A new array of route objects with `Component` and `ErrorBoundary` removed,
   *          and an additional `hasComponent` property indicating if a component was present.
   */
  const sanitizedRoutes = routes.map(route => {
    if (isComponentRoute(route)) {
      const {Component, ErrorBoundary, ...passRoute} = route;
      return {
        ...passRoute,
        hasComponent: !!Component,
      };
    }

    return {
      ...route,
      hasComponent: false,
    };
  });

  const url =
    APP_ROUTER_URL ||
    (route.type === 'bottomtab' ? route.path : APP_ROUTER_URL);

  // Render the component wrapped with ErrorBoundary, Provider, RouterContext, and ComponentIdContext
  return (
    <ErrorBoundary>
      <Provider>
        <RouteContext.Provider
          value={{
            path: route.path,
            name: route.name,
            url,
            data,
            routes: sanitizedRoutes,
          }}>
          <ComponentIdContext.Provider value={componentId}>
            <Component />
          </ComponentIdContext.Provider>
        </RouteContext.Provider>
      </Provider>
    </ErrorBoundary>
  );
}

/**
 * Type guard that narrows the type of the given route to
 * ensure it is either a ComponentRoute or BottomTabRoute.
 *
 * @param route - The route object to be checked.
 * @returns True if the route type is not 'action', indicating
 * that it is a ComponentRoute or BottomTabRoute; otherwise,
 * returns false.
 */
function isComponentRoute(
  route: RouteChildWithoutChildren,
): route is ComponentRoute | BottomTabRoute {
  return route.type !== 'action';
}

/**
 * Registers a single route with the navigation system.
 *
 * This function registers a route's component with `react-native-navigation`, allowing
 * it to be used within the navigation stack. If the route has a `bottomTab` option,
 * it will also be added to the bottom tab layout. The function also assigns custom options
 * to the component via a TypeScript cast, enabling additional metadata to be attached to
 * the component instance.
 *
 * @param {RouteChildWithoutChildren} route - The route definition object, containing details
 * such as the route name, path, and component to render.
 * @param {LayoutRoot} layout - The current layout object for the navigation structure. This is
 * updated if the route has a `bottomTab` option.
 * @param {React.ComponentType<any>} Provider - A React component that wraps the route component
 * as a provider, allowing for dependency injection or state management specific to the route.
 * @param {RouteChildWithoutChildren[]} routes - Array of flattened route definitions, used for
 * navigation and context within the application.
 *
 * @example
 * // Register a route with a provider and optional bottom tab configuration
 * registerRoute(
 *   { path: '/home', name: 'HomeScreen', Component: HomeComponent },
 *   layout,
 *   MyCustomProvider,
 *   routes
 * );
 */
function registerRoute(
  route: RouteChildWithoutChildren,
  layout: LayoutRoot,
  Provider: React.ComponentType<any>,
  routes: RouteChildWithoutChildren[],
): void {
  if (!isComponentRoute(route)) return;

  const {bottomTab, ...passOptions} = route.options ?? {};
  const {ErrorBoundary = Fragment, Component} = route;

  /**
   * Attaches custom `options` to the component by casting it to `any`.
   *
   * In TypeScript, `React.ComponentType<any>` includes only the component's props and
   * rendering behavior, but does not support additional static properties such as custom
   * `options`. Casting `Component` to `any` bypasses TypeScript’s strict type-checking,
   * allowing custom `options` to be assigned as a static property without type errors.
   *
   * @note This cast is necessary because TypeScript enforces that `React.ComponentType`
   *       should only represent functional or class components without additional properties.
   */
  (Component as any).options = passOptions;

  // Register the component with react-native-navigation
  Navigation.registerComponent(
    route.name,
    () => props =>
      renderComponent(route, props, Provider, ErrorBoundary, routes),
    () => Component,
  );

  // If the route has a bottomTab option, add it to the layout
  if (bottomTab) {
    addBottomTabToLayout(layout, route.name, bottomTab, route.stackId);
  }
}

/**
 * Registers routes and sets the root layout for the application.
 *
 * This function configures the application's routing by registering each route with
 * the navigation system and setting the root layout. It also initializes the layout
 * structure and sets up an optional provider for context within the navigation.
 * An optional `onAppLaunched` callback can be provided, which is called when the app
 * completes its launch.
 *
 * @param {Router} appRouter - The main router configuration for the app, including routes,
 *                             an optional launch callback, and an optional provider component.
 * @param {RouteChildWithoutChildren[]} appRouter.routes - Array of route definitions,
 *                                                         detailing paths, components, and options.
 * @param {() => Promise<void>} [appRouter.onAppLaunched] - Optional async callback to be executed
 *                                                         after the app has launched.
 * @param {React.ComponentType<any>} [appRouter.Provider=Fragment] - Optional React component to be used as a provider,
 *                                                                  which wraps all registered routes, allowing for
 *                                                                  dependency injection or context.
 *
 * @example
 * register({
 *   routes: [
 *     { path: '/home', name: 'HomeScreen', Component: HomeComponent },
 *     { path: '/profile', name: 'ProfileScreen', Component: ProfileComponent, options: { bottomTab: { text: 'Profile' } } }
 *   ],
 *   onAppLaunched: async () => {
 *     console.log('App launched');
 *   },
 *   Provider: MyCustomProvider,
 *   setRoot: async (layout) => {
 *     // do some conditional root logic
 *
 *     Navigation.setRoot(layout);
 *   },
 * });
 */
function register({
  onAppLaunched,
  routes,
  Provider = Fragment,
  setRoot,
}: Router) {
  const layout = {root: {}};

  const flattenedRoutes = flatten(routes);

  flattenedRoutes.forEach(route =>
    registerRoute(route, layout, Provider, flattenedRoutes),
  );

  setRootLayout(layout, flattenedRoutes, onAppLaunched, setRoot);
}

export {register};
