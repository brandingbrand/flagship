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

import { createPath, LocationDescriptor, LocationDescriptorObject, parsePath } from 'history';
import { parse } from 'qs';

import pathToRegexp, { Key } from 'path-to-regexp';

import { env } from '../../env';
import { buildPath } from '../../utils';
import { guardRoute } from '../utils';
import { fromPairs } from 'lodash-es';

export const createKey = () => {
  return Math.random().toString(36).substr(2, 8);
};

export const stringifyLocation = (location: LocationDescriptor) => {
  return typeof location === 'string' ? location : createPath(location);
};

export const mapPromisedChildren = async <T>(
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
    const normalizedPath = path.length > 1 ? path.replace(/\/$/, '').replace('//', '/') : path;
    const regex = pathToRegexp(normalizedPath, keys, { strict: route.exact });
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
  tab?: Tab,
  prefix = ''
): Promise<
  (readonly [
    (checkPath: string) => { params: RouteParams } | undefined,
    IndexedComponentRoute | RedirectRoute
  ])[]
> => {
  const { id, path } = buildPath(route, prefix);
  const matchingRoute =
    'component' in route || 'loadComponent' in route
      ? ([
        matchPath(path, route),
        {
          id,
          tabAffinity: tab?.id,
          ...route
        }
      ] as const)
      : undefined;

  const matchingRedirect =
    !matchingRoute && 'redirect' in route ? ([matchPath(path, route), route] as const) : undefined;

  const children =
    !matchingRoute && !matchingRedirect
      ? await mapPromisedChildren(route, async childRoute =>
          buildMatcher(childRoute, tab, 'initialPath' in route ? '' : path)
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
  tab?: Tab
) => {
  try {
    return routes
      .map(async route => buildMatcher(route, 'tab' in route ? route.tab : tab))
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


    if (matched) {
      const routeInfo = {
        params: matched.params,
        query: parse(search.substr(1)),
        path
      };
      if (await guardRoute(route, routeInfo)) {
        if ('redirect' in route) {
          const redirect =
            typeof route.redirect === 'string'
              ? route.redirect
              : route.redirect(routeInfo);
          return matchRoute(matchers, `/${redirect}`);
        }
        if ('id' in route) {
          return {
            ...route,
            params: matched.params,
            query: parse(search.substr(1)),
            matchedPath: path
          };
        }
      }
    }
  }

  return;
};

export const normalizeLocationDescriptor = (
  to: LocationDescriptor<unknown>
): LocationDescriptorObject<unknown> => {
  if (typeof to === 'string') {
    return normalizeLocationDescriptor(parsePath(to));
  }

  let pathname = to.pathname;

  for (const url of env?.associatedDomains ?? []) {
    const regex = new RegExp(`^(https?:\\/\\/)?${url}`);
    pathname = pathname?.replace(regex, '');
  }

  if (typeof env?.urlScheme === 'string') {
    const regex = new RegExp(`^${env.urlScheme}:\\/\\/`);
    pathname = pathname?.replace(regex, '/');
  }

  if (pathname === '') {
    pathname = '/';
  }

  return {
    ...to,
    pathname
  };
};

