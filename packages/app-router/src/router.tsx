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
 * Creates the initial layout object for the application.
 *
 * @returns {LayoutRoot} The initial layout object.
 *
 * @example
 * const initialLayout = createInitialLayout();
 * console.log(initialLayout); // { root: {} }
 */
function createInitialLayout(): LayoutRoot {
  return {root: {}};
}

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

    const currentStackId = (function () {
      if (route.type === 'bottomtab') {
        return route.stackId;
      }

      return parentStackId;
    })();

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

    Navigation.setRoot(layout);
  });
}

/**
 * Adds a bottom tab to the root layout.
 *
 * @param {LayoutRoot} layout - The current layout object.
 * @param {string} routeName - The name of the route associated with the bottom tab.
 * @param {any} bottomTab - The bottom tab configuration.
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
 * Renders the component for a given route.
 *
 * @param {Route} route - The route definition.
 * @param {any} props - The properties passed to the component.
 * @param {React.ComponentType} Provider - The React component to be used as a provider.
 * @param {Record<string, string>} routeMap - A map of route paths to route names.
 * @param {React.ComponentType} ErrorBoundary - The component to be used as an error boundary.
 * @returns {JSX.Element} The rendered component wrapped in the necessary providers.
 *
 * @example
 * const renderedComponent = renderComponent(
 *   { path: '/home', name: 'HomeScreen', Component: HomeComponent },
 *   { componentId: 'component1', __flagship_app_router_url: 'https://example.com' },
 *   MyCustomProvider,
 *   routeMap,
 *   MyErrorBoundary
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

  // Render the component wrapped with ErrorBoundary, Provider, RouterContext, and ComponentIdContext
  return (
    <ErrorBoundary>
      <Provider>
        <RouteContext.Provider
          value={{
            path: route.path,
            name: route.name,
            url: APP_ROUTER_URL,
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
 * @param {Route} route - The route definition.
 * @param {LayoutRoot} layout - The current layout object.
 * @param {Record<string, string>} routeMap - A map of route paths to route names.
 * @param {React.ComponentType} Provider - The React component to be used as a provider.
 *
 * @example
 * registerRoute(
 *   { path: '/home', name: 'HomeScreen', Component: HomeComponent },
 *   layout,
 *   routeMap,
 *   MyCustomProvider
 * );
 */
function registerRoute(
  route: RouteChildWithoutChildren,
  layout: LayoutRoot,
  Provider: React.ComponentType,
  routes: RouteChildWithoutChildren[],
): void {
  if (!isComponentRoute(route)) return;

  const {bottomTab, ...passOptions} = route.options;
  const {ErrorBoundary = Fragment, Component} = route;

  /**
   * Attaches custom `options` to the component by casting to `any`.
   *
   * In TypeScript, `React.ComponentType<any>` only includes the type for the component itself
   * (e.g., its props and rendering behavior) and doesn't support additional static properties,
   * such as custom metadata like `options`.
   *
   * Casting `Component` to `any` bypasses TypeScript's type-checking,
   * allowing us to attach `options` as a static property without type errors.
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
 * @param {AppRouter} appRouter - The router configuration for the app.
 * @param {Route[]} appRouter.routes - Array of route definitions.
 * @param {Function} [appRouter.onAppLaunched] - Optional callback to be called after the app is launched.
 * @param {React.ComponentType} [appRouter.Provider=Fragment] - Optional React component to be used as a provider.
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
 * });
 */
function register({onAppLaunched, routes, Provider = Fragment}: Router) {
  const layout = createInitialLayout();

  const flattenedRoutes = flatten(routes);

  flattenedRoutes.forEach(route =>
    registerRoute(route, layout, Provider, flattenedRoutes),
  );

  setRootLayout(layout, flattenedRoutes, onAppLaunched);
}

export {register};
