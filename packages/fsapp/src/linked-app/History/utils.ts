import type { OptionsBottomTab } from 'react-native-navigation';
import type {
  ActivatedRoute,
  IndexedComponentRoute,
  MatchingRoute,
  RedirectRoute,
  ResolverConstructor,
  ResolverFunction,
  Route,
  RouteData,
  Routes
} from '../types';

import { createPath, LocationDescriptor, parsePath } from 'history';
import { parse } from 'qs';

import { match, MatchFunction } from 'path-to-regexp';

import { buildPath } from '../utils';
import { fromPairs } from 'lodash-es';

export const stringifyLocation = (location: LocationDescriptor) => {
  return typeof location === 'string' ? location : createPath(location);
};

export const mapPromisedChildren = async <T extends any>(
  route: Route,
  callback: (route: Route) => T[] | Promise<T[]>
) => {
  const childRoutes = 'children' in route ? route.children : [];
  const mappedChildren = await Promise.all(
    childRoutes.map(async childRoute => callback(childRoute))
  );

  return mappedChildren.reduce((prev, next) => [...prev, ...next], []);
};

const buildMatcher = async (
  route: Route,
  tab: string | OptionsBottomTab = '',
  prefix = ''
): Promise<(readonly [MatchFunction, IndexedComponentRoute | RedirectRoute])[]> => {
  const { id, path } = buildPath(route, prefix);

  const matchingRoute =
    'component' in route || 'lazyComponent' in route
      ? ([
        (checkPath: string) =>
            match(path ?? '', { strict: route.exact })(checkPath.split('?')[0]),
        {
          id,
          tabAffinity: typeof tab === 'string' ? tab : tab.text,
          ...route
        }
      ] as const)
      : undefined;

  const matchingRedirect =
    !matchingRoute && 'redirect' in route
      ? ([match(path ?? '', { strict: route.exact }), route] as const)
      : undefined;

  const children =
    !matchingRoute && !matchingRedirect
      ? await mapPromisedChildren(route, childRoute =>
          buildMatcher(childRoute, 'tab' in route ? route.tab ?? tab : tab, path)
        )
      : [];

  return [
    ...(matchingRoute ? [matchingRoute] : []),
    ...(matchingRedirect ? [matchingRedirect] : []),
    ...children
  ];
};

export const buildMatchers = async (
  routes: Routes,
  tab?: string | OptionsBottomTab,
  prefix?: string
) => {
  try {
    return routes
      .map(route => buildMatcher(route, tab, prefix))
      .reduce(async (prev, next) => [...(await prev), ...(await next)], Promise.resolve([]));
  } catch (e) {
    return [];
  }
};

export type Matchers = ReturnType<typeof buildMatchers>;

export const resolve = async (
  resolver: ResolverConstructor | ResolverFunction,
  activatedRoute: ActivatedRoute
) => {
  const isClass = (
    classOrFunction: ResolverConstructor | ResolverFunction
  ): classOrFunction is ResolverConstructor =>
    classOrFunction.prototype && 'resolve' in classOrFunction.prototype;

  if (isClass(resolver)) {
    return new resolver(activatedRoute).resolve();
  } else {
    return resolver(activatedRoute);
  }
};

export const resolveRoute = (route: MatchingRoute): RouteData => {
  const resolved = fromPairs(
    Object.entries(route.resolve ?? {}).map(([key, resolver]) => [
      key,
      resolve(resolver, {
        data: route.data ?? {},
        params: route.params,
        query: route.query,
        loading: true
      })
    ])
  );
  return {
    ...route.data,
    ...resolved
  };
};

export const matchRoute = async (
  matchers: Matchers,
  path: string
): Promise<MatchingRoute | undefined> => {
  const { search } = parsePath(path);
  for (const [matcher, route] of await matchers) {
    const matched = matcher(path);
    if (matched && 'redirect' in route) {
      return matchRoute(matchers, `/${route.redirect}`);
    }

    if (matched && 'id' in route) {
      return {
        ...route,
        params: matched.params as Record<string, string | undefined>,
        query: parse(search),
        matchedPath: path
      };
    }
  }

  return;
};
