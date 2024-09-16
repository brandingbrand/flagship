import {Options, OptionsBottomTab} from 'react-native-navigation';
import URLParse from 'url-parse';

/**
 * Represents the main router configuration object.
 */
export type Router = {
  /**
   * Array of routes to be registered with the router.
   *
   * These routes define the various paths and navigation options
   * for the application.
   */
  routes: IndexRoute[];

  /**
   * Optional provider component that wraps the application.
   *
   * If provided, this component will be used to wrap the entire app,
   * useful for providing context or global state.
   */
  Provider?: React.ComponentType<any>;

  /**
   * Optional callback that is executed when the app is launched.
   *
   * This function can perform initialization tasks like setting up
   * resources, loading configurations, etc. It returns a promise that
   * resolves when the app is fully ready.
   */
  onAppLaunched?: () => Promise<void>;
};

/**
 * Provides control flow for guarding navigation.
 *
 * This object is passed to the `Guard` function to handle navigation
 * actions such as canceling the navigation, redirecting to a different
 * path, or displaying a modal.
 */
export type Next = {
  /**
   * Cancels the current navigation process.
   */
  cancel: () => void;

  /**
   * Redirects the user to a different path.
   *
   * @param path - The target URL or path to redirect to.
   */
  redirect: (path: string) => void;

  /**
   * Displays a modal component.
   *
   * @template T - The type of data to pass to the modal.
   * @template U - The type of data the modal resolves to.
   *
   * @param Component - The React component to display as a modal.
   * @param data - The data to pass to the modal component.
   * @param options - Navigation options for configuring the modal display.
   * @returns A promise that resolves when the modal is dismissed.
   */
  showModal: <T, U>(
    Component: React.ComponentType,
    data: T,
    options: Options,
  ) => Promise<U>;
};

/**
 * Represents a guard function that handles navigation logic.
 *
 * Guards are invoked before navigating to a route, allowing for
 * tasks like authentication checks, data fetching, or route validation.
 *
 * @param to - The target URL being navigated to.
 * @param from - The previous URL being navigated from, or undefined if none.
 * @param next - The `Next` object providing control over the navigation.
 * @returns A promise that resolves when the guard completes its task.
 */
export type Guard = (
  to: URLParse<any>,
  from: URLParse<any> | undefined,
  next: Next,
) => Promise<void>;

/**
 * Base type for route definitions, shared across different route types.
 */
export type RouteBase = {
  /**
   * The URL path associated with this route.
   */
  path: string;

  /**
   *
   */
  name: string;

  /**
   * Optional array of guard functions to be executed before navigating to this route.
   */
  guards?: Guard[];

  /**
   * Optional nested child routes that extend the functionality of this route.
   */
  children?: RouteChild[];
};

/**
 * Represents a route that is part of a bottom tab navigation.
 */
export type BottomTabRoute = RouteBase & {
  /**
   * A constant identifying this route as a bottom tab.
   */
  type: 'bottomtab';

  /**
   * Navigation options specific to this route, excluding `bottomTab` options.
   */
  options: Omit<Options, 'bottomTab'> & {bottomTab: OptionsBottomTab};

  /**
   * The name of this route, used for identifying and navigating to the route.
   */
  name: string;

  /**
   * The React component to render when this route is active.
   */
  Component: React.ComponentType;

  /**
   * Optional error boundary component to handle any errors in the `Component`.
   */
  ErrorBoundary?: React.ComponentClass;

  /**
   * Identifier for the navigation stack associated with this route.
   *
   * Used to distinguish between different stacks in the bottom tab navigation.
   */
  stackId: string;
};

/**
 * Represents a route that triggers an action instead of rendering a component.
 */
export type ActionRoute = RouteBase & {
  /**
   * A constant identifying this route as an action route.
   */
  type: 'action';

  /**
   * A function that performs an action when the route is navigated to.
   *
   * @param url - The full URL being navigated to.
   * @param pathParams - Parameters parsed from the path.
   * @param queryParams - Parameters parsed from the query string.
   * @returns A promise that resolves when the action is completed.
   */
  action: (
    url: string,
    pathParams: object,
    queryParams: object,
  ) => Promise<void>;
};

/**
 * Represents a route that renders a React component.
 */
export type ComponentRoute = RouteBase & {
  /**
   * A constant identifying this route as a component route.
   */
  type: 'component';

  /**
   * Optional navigation options specific to this route.
   */
  options?: Options;

  /**
   * The name of this route, used for identifying and navigating to the route.
   */
  name: string;

  /**
   * The React component to render when this route is active.
   */
  Component: React.ComponentType;

  /**
   * Optional error boundary component to handle any errors in the `Component`.
   */
  ErrorBoundary?: React.ComponentClass;
};

/**
 * Represents a top-level route that can either be a bottom tab, action, or component route.
 *
 * `IndexRoute` excludes child routes from `ActionRoute` and `ComponentRoute`, making it
 * suitable for defining the main navigation structure.
 */
export type IndexRoute =
  | BottomTabRoute
  | Omit<ActionRoute, 'children'>
  | Omit<ComponentRoute, 'children'>;

/**
 * Represents a child route, either an action or component route.
 */
export type RouteChild = ActionRoute | ComponentRoute;

/**
 * Represents a child route, either an action or component route without children.
 */
export type RouteChildWithoutChildren = {stackId?: string} & (
  | Omit<ActionRoute, 'children'>
  | Omit<ComponentRoute, 'children'>
);

/**
 * Represents the data structure for a modal component.
 * @template T The type of data passed to the modal.
 * @template U The type of result returned by the modal.
 */
export type ModalData<T, U> = {
  /**
   * A function that returns another function to resolve the modal with a result.
   * @param componentId The unique identifier of the modal component.
   * @returns A function that takes a result and returns it.
   */
  resolve: (componentId: string) => (result: U) => U;

  /**
   * A function that returns another function to reject or close the modal without a result.
   * @param componentId The unique identifier of the modal component.
   * @returns A function that closes the modal without returning a result.
   */
  reject: (componentId: string) => () => void;

  /**
   * The data passed to the modal component.
   */
  data: T;
};

export type RouteMatch = {
  /**
   * The name of the route, used for registration with React Native Navigation
   */
  name: string;

  /**
   * The path pattern associated with the route
   */
  path: string;

  /**
   * Type representing the URL object
   */
  url: string | null;

  /**
   * Type representing any data associated with the router
   */
  data: unknown;

  /**
   * Array of routes to be registered with the router
   */
  routes: (Omit<RouteChildWithoutChildren, 'Component' | 'ErrorBoundary'> & {
    hasComponent: boolean;
  })[];
};
