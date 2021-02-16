import type { Dictionary } from '@brandingbrand/fsfoundation';
import type {
  ActivatedRoute,
  IndexedComponentRoute,
  MatchingRoute,
  RedirectRoute,
  ResolverConstructor,
  ResolverFunction,
  Route,
  RouteData,
  RouteParams,
  Routes,
  Tab
} from '../types';

import { createPath, LocationDescriptor, parsePath } from 'history';
import { parse } from 'qs';

import pathToRegexp, { Key } from 'path-to-regexp';

import { buildPath } from '../../utils';
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

const matchPath = (path: string | undefined, route: Route) => {
  return (checkPath: string) => {
    if (!path) {
      if (route.exact) {
        return checkPath.split('?')[0] === '' ? { params: {} } : undefined;
      }

      return { params: {} };
    }

    const keys: Key[] = [];
    const regex = pathToRegexp(path.replace(/\/$/, ''), keys, { strict: route.exact });
    const [url, ...params] = regex.exec(checkPath.split('?')[0]) ?? [];
    return url
      ? {
        params: keys.reduce<Dictionary<string>>((memo, key, index) => {
          return {
            ...memo,
            [key.name]: params[index]
          };
        }, {})
      }
      : undefined;
  };
};

const buildMatcher = async (
  route: Route,
  tab: Tab = '',
  prefix = ''
): Promise<
  (readonly [
    (checkPath: string) => { params: RouteParams } | undefined,
    IndexedComponentRoute | RedirectRoute
  ])[]
> => {
  const { id, path } = buildPath(route, prefix);

  const matchingRoute =
    'component' in route || 'lazyComponent' in route
      ? ([
        matchPath(path, route),
        {
          id,
          tabAffinity: typeof tab === 'string' ? tab : tab.id,
          ...route
        }
      ] as const)
      : undefined;

  const matchingRedirect =
    !matchingRoute && 'redirect' in route ? ([matchPath(path, route), route] as const) : undefined;

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
  tab?: Tab,
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
        query: route.query,
        params: route.params,
        path: route.matchedPath,
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
        params: matched.params,
        query: parse(search.substr(1)),
        matchedPath: path
      };
    }
  }

  return;
};
