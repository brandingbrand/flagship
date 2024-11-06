import {LayoutRoot, Options, OptionsBottomTab} from 'react-native-navigation';
import URLParse from 'url-parse';

/**
 * Represents the main router configuration object.
 *
 * The Router type defines the structure of the routing configuration
 * used in the application, specifying the routes, an optional provider
 * for context, and an optional function that is called when the app is launched.
 */
export type Router = {
  /** An array of routes defined in the application. */
  routes: IndexRoute[];

  /**
   * An optional React component that acts as a provider for context.
   * This can be used to provide state or functionality to the routing
   * mechanism or child components.
   */
  Provider?: React.ComponentType<any>;

  /**
   * An optional function that is called when the application is launched.
   * This function may return a promise to perform any asynchronous initialization.
   */
  onAppLaunched?: () => Promise<void>;

  /**
   * Sets the root layout for the navigation system.
   *
   * The `setRoot` function is used to initialize and configure the root layout
   * of the application’s navigation. This function is typically called once,
   * usually after app launch, to define the main navigation structure.
   *
   * @param {LayoutRoot} layout - The root layout configuration object,
   * which specifies the initial screen(s) and layout options for the navigation system.
   *
   * @returns {Promise<void>} A promise that resolves when the root layout
   * has been successfully set, allowing for any necessary setup completion
   * or additional configuration after navigation initialization.
   *
   * @example
   * const layout: LayoutRoot = {
   *   root: {
   *     bottomTabs: {
   *       children: [
   *         { component: { name: 'HomeScreen' } },
   *         { component: { name: 'ProfileScreen' } }
   *       ]
   *     }
   *   }
   * };
   *
   * function setRoot(layout) {
   *   // do some conditional root
   *
   *   Navigation.setRoot(layout);
   * }
   */
  setRoot?: (layout: LayoutRoot) => Promise<void>;
};

/**
 * Provides control flow for guarding navigation.
 *
 * The Next type defines the methods available for controlling the navigation
 * flow when guards are invoked. This includes the ability to cancel navigation,
 * redirect to a different path, and show a modal component.
 */
export type Next = {
  /** Cancels the current navigation action. */
  cancel: () => void;

  /**
   * Redirects to a specified path.
   * @param path The path to redirect to.
   */
  redirect: (path: string) => void;

  /**
   * Shows a modal with the specified component, passing data and options.
   * @param Component The React component to display in the modal.
   * @param data The data to pass to the modal component.
   * @param options Navigation options for the modal.
   * @returns A promise that resolves with the result from the modal.
   */
  showModal: <T, U>(
    Component: React.ComponentType,
    data: T,
    options: Options,
  ) => Promise<U>;
};

/**
 * Represents a guard function for navigation logic.
 *
 * Guards are functions that determine whether a navigation action should
 * proceed. They receive information about the target and current routes
 * and provide control over the navigation flow.
 *
 * @param to The target URL to navigate to.
 * @param from The current URL from which the navigation is initiated, or undefined.
 * @param next An object providing methods to control the navigation flow.
 * @returns A promise that resolves when the guard has completed its logic.
 */
export type Guard = (
  to: URLParse<Record<string, string | undefined>>,
  from: URLParse<Record<string, string | undefined>> | undefined,
  next: Next,
) => Promise<void>;

/**
 * Base type for route definitions.
 *
 * This interface provides the common properties that all route types
 * share, including the path, name, and optional guards.
 */
interface RouteBase {
  /** The path associated with the route. */
  path: string;

  /** The name of the route. */
  name: string;

  /** Optional array of guard functions for this route. */
  guards?: Guard[];
}

/**
 * Common properties for routes with components.
 *
 * This interface extends the RouteBase, adding properties specific to
 * routes that render React components, such as the component itself,
 * optional navigation options, and an error boundary component.
 */
interface ComponentRouteBase extends RouteBase {
  /** The React component to render for this route. */
  Component: React.ComponentType;

  /** Optional navigation options for the route. */
  options?: Options;

  /**
   * An optional error boundary component to catch errors in the child component tree.
   */
  ErrorBoundary?: React.ComponentClass;
}

/**
 * Route representing a bottom tab.
 *
 * This route type is used for defining bottom tab navigators. It extends
 * the ComponentRouteBase and includes options specific to bottom tab navigation.
 */
export type BottomTabRoute = ComponentRouteBase & {
  /** Indicates the type of this route. */
  type: 'bottomtab';

  /** Navigation options for the bottom tab, excluding default bottomTab options. */
  options: Omit<Options, 'bottomTab'> & {bottomTab: OptionsBottomTab};

  /** Unique identifier for the stack associated with this tab. */
  stackId: string;

  /**
   * An optional array of child routes that can be nested within this bottom tab.
   */
  children?: RouteChild[];
};

/**
 * Route representing an action.
 *
 * This route type defines actions that can be performed in the application.
 * It includes a function to handle the action based on the URL and parameters.
 */
export interface ActionRoute extends RouteBase {
  /** Indicates the type of this route. */
  type: 'action';

  /**
   * The action to perform when navigating to this route.
   * @param url The URL associated with the action.
   * @param pathParams Parameters extracted from the URL path.
   * @param queryParams Parameters extracted from the URL query string.
   * @returns A promise that resolves when the action is completed.
   */
  action: (
    url: string,
    pathParams: Partial<Record<string, string | string[]>>,
    queryParams: Record<string, string | undefined>,
  ) => Promise<void>;

  /**
   * An optional array of child routes that can be nested under this action route.
   */
  children?: RouteChild[];
}

/**
 * Route representing a component screen.
 *
 * This route type is used for defining screens that render a specific React component.
 * It includes properties for the component, navigation options, and an optional error boundary.
 */
export type ComponentRoute = ComponentRouteBase & {
  /** Indicates the type of this route. */
  type: 'component';

  /**
   * An optional array of child routes that can be nested under this component route.
   */
  children?: RouteChild[];
};

/**
 * Defines a top-level route, excluding nested children.
 *
 * This type is a union of route types that are valid as top-level routes
 * in the router. It excludes the children property to ensure that only
 * top-level routes are defined.
 */
export type IndexRoute =
  | BottomTabRoute
  | Omit<ActionRoute, 'children'>
  | Omit<ComponentRoute, 'children'>;

/**
 * Represents a child route for nested structures.
 *
 * Child routes can either be action routes or component routes, allowing
 * for a flexible structure of nested navigation.
 */
export type RouteChild = ActionRoute | ComponentRoute;

/**
 * Represents a child route without nested children.
 *
 * This type is a union of action and component routes, excluding the
 * 'children' property to ensure that only top-level child routes can be
 * defined within a parent route. It may optionally include a stack ID,
 * which can be used to identify the stack associated with the route.
 */
export type RouteChildWithoutChildren = {
  /**
   * An optional identifier for the stack associated with this child route.
   * This can be used for navigation and managing route state within the stack.
   */
  stackId?: string;
} & Omit<BottomTabRoute | RouteChild, 'children'>;

/**
 * RouteMatch definition for matching routes within the router.
 *
 * This interface describes the result of matching a route within the
 * routing configuration, including the route name, path, URL, and
 * any nested routes that are present.
 */
export interface RouteMatch {
  /** The name of the matched route. */
  name: string;

  /** The path of the matched route. */
  path: string;

  /** The resolved URL for the matched route, or null if not applicable. */
  url: string | null;

  /** Additional data associated with the matched route. */
  data: unknown;

  /**
   * An array of nested routes, excluding the Component and ErrorBoundary properties,
   * along with a flag indicating whether the route has a component.
   */
  routes: RouteMatchRoute[];
}

/**
 * Represents a matched route used for navigation or routing purposes.
 *
 * This type includes all properties from either `BottomTabRoute` or `RouteChild`,
 * except `Component` and `ErrorBoundary`, which are omitted.
 * Additional properties specific to the match are added for use in the routing logic.
 *
 * - `hasComponent` indicates whether a component is associated with this route.
 * - `stackId` (optional) is a unique identifier for a stack of routes if needed
 *   for hierarchical navigation, such as in nested stacks.
 */
export type RouteMatchRoute = Omit<
  BottomTabRoute | RouteChild,
  'Component' | 'ErrorBoundary'
> & {
  /**
   * Indicates if the route has an associated component.
   */
  hasComponent: boolean;

  /**
   * An optional identifier for the navigation stack to which this route belongs.
   * This is useful in cases where route nesting or stack-based navigation is required.
   */
  stackId?: string;
};

/**
 * Modal data for managing component modals.
 *
 * This type encapsulates the data required for managing modal components,
 * including methods to resolve or reject the modal.
 */
export type ModalData<T, U> = {
  /**
   * Function to resolve the modal with the given component ID and result.
   * @param componentId The ID of the modal component.
   * @returns A function that takes the result to resolve the modal.
   */
  resolve: (componentId: string) => (result: U) => U;

  /**
   * Function to reject the modal with the given component ID.
   * @param componentId The ID of the modal component.
   * @returns A function that rejects the modal.
   */
  reject: (componentId: string) => () => void;
};
