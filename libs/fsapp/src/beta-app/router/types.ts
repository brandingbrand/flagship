import type FSNetwork from '@brandingbrand/fsnetwork';
import type { Analytics } from '@brandingbrand/fsengage';
import type { Dictionary } from '@brandingbrand/fsfoundation';
import type {
  OptionsBottomTab,
  OptionsStatusBar,
  OptionsTopBar,
  OptionsTopBarButton,
  OptionsTopBarTitle,
} from 'react-native-navigation';
import type { ParsedQs } from 'qs';
import type { ShellConfig } from '../shell.web';

import { Component, ComponentType, FC } from 'react';

export type ActionButton = OptionsTopBarButton & { onPress?: () => void };

export interface ScreenOptions {
  buttons?: {
    rightButtons?: ActionButton[];
    leftButtons?: ActionButton[];
  };
}

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
export type ScreenFC = FC<{ componentId: string }> & ScreenOptions;
export abstract class ScreenComponent<State = {}> extends Component<
  { componentId: string },
  State
> {
  static buttons?: ScreenOptions['buttons'];
}
export type ScreenComponentType = ScreenFC | typeof ScreenComponent;
export type Tab = OptionsBottomTab & { id: string };

export type RouteData = Dictionary<unknown | undefined>;
export type RouteParams = Dictionary<string | undefined>;
export type RouteQuery = ParsedQs;

export interface ActivatedRoute {
  readonly path: string | undefined;
  readonly loading: boolean;
  readonly data: RouteData;
  readonly params: RouteParams;
  readonly query: RouteQuery;
}

export interface Resolver<Data = unknown> {
  resolve(): Data | Promise<Data>;
}

export type ResolverConstructor<Data = unknown> = new (route: ActivatedRoute) => Resolver<Data>;

// Guaranteed to be in the context of a React Function, so hooks will work as expected.
export type ResolverFunction<Data = unknown> = (route: ActivatedRoute) => Data | Promise<Data>;

export interface Activator {
  activate(): boolean | Promise<boolean>;
}

export type ActivatorConstructor = new (
  route: Pick<ActivatedRoute, 'params' | 'query' | 'path'>
) => Activator;

// Guaranteed to be in the context of a React Function, so hooks will work as expected.
export type ActivatorFunction = (
  route: Pick<ActivatedRoute, 'params' | 'query' | 'path'>
) => boolean | Promise<boolean>;

// Uses a similar pattern to that of the Angular and Vue
// Routers, this should make it familiar to those who have
// dabbled at all in those ecosystems and should make migrations
// to Vue (or whatever comes next) much easier
export interface BaseRoute {
  readonly path?: string;
  readonly exact?: true;
  readonly quickDevMenu?: true;
  readonly canActivate?: ActivatorConstructor | ActivatorFunction;
}

export type TopBarStyle = Omit<OptionsTopBar, 'title'> & {
  title?: Omit<OptionsTopBarTitle, 'text'>;
  leftButtons?: never;
  rightButtons?: never;
};

export interface ComponentRoute extends BaseRoute {
  readonly component: ScreenComponentType;

  readonly title?: string | ((activatedRoute: ActivatedRoute) => string | Promise<string>);
  readonly topBarStyle?: TopBarStyle;
  readonly statusBarStyle?: OptionsStatusBar;

  // Used to pass in static data
  readonly data?: RouteData;
  // Used to pass in dynamic data
  readonly resolve?: Dictionary<ResolverConstructor | ResolverFunction>;

  // Props are never passed directly to the component,
  // with React Navigation this is inherently not type
  // safe, so there is no `passProps`

  // Additional options like `canActivate` or `canDeactivate`
  // could be added in the future to provide even more
  // functionality

  readonly disableTracking?: true;
}

export interface LazyComponentRoute extends Omit<ComponentRoute, 'component'> {
  readonly loadComponent: (activatedRoute: ActivatedRoute) => Promise<ScreenComponentType>;
}

export interface ParentRoute extends BaseRoute {
  readonly children: Route[];
}

/**
 * RouteCollection - tabbed collection of routes *
 *
 * @param {Exclude<string, ''>} initialPath Must match a child route
 * @param {Tab} tab Tab used for tabAffinity
 * @param {Route[]} children Child routes in collection
 */
export interface RouteCollection {
  readonly initialPath: Exclude<string, ''>;
  readonly tab: Tab;
  readonly children: Route[];
  readonly topBarStyle?: TopBarStyle;
  readonly statusBarStyle?: OptionsStatusBar;
}

export interface RedirectRoute extends BaseRoute {
  readonly redirect:
    | ((route: Pick<ActivatedRoute, 'params' | 'query' | 'path'>) => string)
    | string;
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
export type Route = ComponentRoute | LazyComponentRoute | RedirectRoute | ParentRoute;

/**
 * A list of routes
 *
 * @see Route
 */
export type Routes = readonly (Route | RouteCollection)[];

export type ExternalRoute = Route & { readonly tabAffinity?: string };
export type ExternalRoutes = readonly ExternalRoute[];

/**
 * Routes that will be loaded asynchronously at the start of
 * the application
 */
export type ExternalRouteFactory =
  | Promise<ExternalRoutes>
  | ((api?: FSNetwork) => Routes | Promise<ExternalRoutes>);

export type IndexedComponentRoute =
  | (ComponentRoute & {
      readonly id: string;
    })
  | (LazyComponentRoute & {
      readonly id: string;
    });

export type MatchingRoute = IndexedComponentRoute & {
  readonly params: RouteParams;
  readonly query: RouteQuery;
  readonly matchedPath: string;
  readonly tabAffinity?: string;
};

export interface RouterConfig {
  readonly routes: Routes;
  readonly externalRoutes?: ExternalRouteFactory;
  readonly loading?: JSX.Element;
}

export interface InternalRouterConfig {
  readonly api?: FSNetwork;
  readonly analytics?: Analytics;
  readonly screenWrap?: ComponentType;
  readonly shell?: ShellConfig;
}

export interface FSRouter {
  readonly routes: Routes;
  open(url: string): Promise<void>;
}

export interface FSRouterConstructor<T extends FSRouter = FSRouter> {
  new (routes: Routes, options: RouterConfig & InternalRouterConfig): T;
  register(options: RouterConfig & InternalRouterConfig): Promise<FSRouter>;
}
