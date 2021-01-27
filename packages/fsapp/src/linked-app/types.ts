import FSNetwork from '@brandingbrand/fsnetwork';
import { ParsedQs } from 'qs';
import { Component, FC } from 'react';
import { OptionsBottomTab } from 'react-native-navigation';

/**
 * A Function Component that expects no props.
 *
 * @note
 * Props are explicitly forbidden at top level components to ensure type safety.
 * To access route level data, ie `params` or `navigator` then used the provided
 * context.
 *
 * @see useNavigator - hook into the navigator context
 * @see useActivatedRoute - hook into the params, query and data context
 * @see useRouteParams - hook into the params context
 * @see useRouteQuery - hook into the query context
 * @see useRouteData - hook into the the data context
 */
export type RouteFC = FC;
export abstract class RouteComponent<State = {}> extends Component<{}, State> {}
export type RouteComponentType = RouteFC | typeof RouteComponent;
export type Tab = string | OptionsBottomTab;

export type RouteData = Record<string, unknown | undefined>;
export type RouteParams = Record<string, string | undefined>;
export type RouteQuery = ParsedQs;

export interface ActivatedRoute {
  path: string | undefined;
  loading: boolean;
  data: RouteData;
  params: RouteParams;
  query: RouteQuery;
}

export interface Resolver<Data = unknown> {
  resolve(): Data | Promise<Data>;
}

export type ResolverConstructor<Data = unknown> = new (route: ActivatedRoute) => Resolver<Data>;

// Guaranteed to be in the context of a React Function, so hooks will work as expected.
export type ResolverFunction<Data = unknown> = (route: ActivatedRoute) => Data | Promise<Data>;

// Uses a similar pattern to that of the Angular and Vue
// Routers, this should make it familiar to those who have
// dabbled at all in those ecosystems and should make migrations
// to Vue (or whatever comes next) much easier
export interface BaseRoute {
  path?: string;
  exact?: boolean;
}

export interface ComponentRoute extends BaseRoute {
  component: RouteComponentType;

  title: string | ((activatedRoute: ActivatedRoute) => string | Promise<string>);

  // Used to pass in static data
  data?: RouteData;
  // Used to pass in dynamic data
  resolve?: Record<string, ResolverConstructor | ResolverFunction>;

  // Props are never passed directly to the component,
  // with React Navigation this is inherently not type
  // safe, so there is no `passProps`

  // Additional options like `canActivate` or `canDeactivate`
  // could be added in the future to provide even more
  // functionality
}

export interface LazyComponentRoute extends Omit<ComponentRoute, 'component'> {
  lazyComponent: () => Promise<RouteComponentType>;
}

export interface ParentRoute extends BaseRoute {
  children: (Route & { tab?: never })[];
}

export interface TopLevelParentRoute extends ParentRoute {
  tab?: Tab;
}

export interface RedirectRoute extends BaseRoute {
  redirect: string;
}

/**
 * @description Schematic to used to build a route at the startup of the application.
 * @see ComponentRoute - route that will render a given component
 * @see LazyComponentRoute - route that will render a dynamically loaded component
 * @see ParentRoute - route that contains child routes
 * @see RedirectRoute - route that will redirect to another route
 * @example
 * ```ts
 * {
 *   path: 'home',
 *   component: HomeComponent
 * }
 * ```
 *
 * @note -- Exclusive Typing
 *
 * This can only be one of `ComponentRoute`, `LazyComponentRoute`, `ParentRoute` or `RedirectRoute`
 * If these types are intersected then the type that matches first in the order above
 * will be applied.
 *
 * @example
 * ```ts
 * [
 *   {
 *     component: Something,
 *     redirect: 'somewhere-else'
 *   }
 * ]
 * ```
 * Because `component` is in the type, `redirect` will be ignored.
 *
 * This typing will be more explicit when this issue is resolved:
 * https://github.com/Microsoft/TypeScript/issues/12936
 */
export type Route =
  | ComponentRoute
  | LazyComponentRoute
  | RedirectRoute
  | ParentRoute
  | TopLevelParentRoute;

/**
 * A list of routes
 * @see Route
 */
export type Routes = readonly Route[];

/**
 * Routes that will be loaded asynchronously at the start of
 * the application
 */
export type ExternalRoutes = Promise<Routes> | ((api?: FSNetwork) => Routes | Promise<Routes>);

export type IndexedComponentRoute =
  | (ComponentRoute & {
    id: string;
  })
  | (LazyComponentRoute & {
    id: string;
  });

export type MatchingRoute = IndexedComponentRoute & {
  params: RouteParams;
  query: RouteQuery;
  matchedPath: string;
  tabAffinity?: string;
};
