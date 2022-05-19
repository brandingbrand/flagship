import type { LocationDescriptor, LocationDescriptorObject } from 'history';
import { createPath, parsePath } from 'history';
import type { Key } from 'path-to-regexp';
import pathToRegexp from 'path-to-regexp';
import { parse } from 'qs';

import { env } from '../../env';
import { buildPath } from '../../utils';
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
  Tab,
} from '../types';
import { guardRoute } from '../utils';

export const createKey = () => Math.random().toString(36).slice(2, 10);

export const stringifyLocation = (location: LocationDescriptor) =>
  typeof location === 'string' ? location : createPath(location);

export const mapPromisedChildren = async <T>(
  route: Route,
  callback: (route: Route) => Promise<T[]> | T[]
) => {
  const childRoutes = 'children' in route ? route.children : [];
  const mappedChildren = await Promise.all(
    childRoutes.map(async (childRoute) => callback(childRoute))
  );

  return mappedChildren.flat();
};

const matchPath = (path: string | undefined, route: Route) => (checkPath: string) => {
  if (!path) {
    if (route.exact) {
      return checkPath.split('?')[0] === '' ? { params: {} } : undefined;
    }

    return { params: {} };
  }

  const keys: Key[] = [];
  const normalizedPath = path.length > 1 ? path.replace(/\/$/, '').replace('//', '/') : path;
  const regex = pathToRegexp(normalizedPath, keys, { strict: route.exact });
  const [url, ...params] = regex.exec(checkPath.split('?')[0] ?? '') ?? [];
  return url
    ? {
        params: Object.fromEntries(keys.map((key, index) => [key.name, params[index] as string])),
      }
    : undefined;
};

const buildMatcher = async (
  route: Route,
  tab?: Tab,
  prefix = ''
): Promise<
  Array<
    readonly [
      (checkPath: string) => { params: RouteParams } | undefined,
      IndexedComponentRoute | RedirectRoute
    ]
  >
> => {
  const { id, path } = buildPath(route, prefix);
  const matchingRoute =
    'component' in route || 'loadComponent' in route
      ? ([
          matchPath(path, route),
          {
            id,
            tabAffinity: tab?.id,
            ...route,
          },
        ] as const)
      : undefined;

  const matchingRedirect =
    !matchingRoute && 'redirect' in route ? ([matchPath(path, route), route] as const) : undefined;

  const children =
    !matchingRoute && !matchingRedirect
      ? await mapPromisedChildren(route, async (childRoute) =>
          buildMatcher(childRoute, tab, 'initialPath' in route ? '' : path)
        )
      : [];

  return [
    ...(matchingRoute ? [matchingRoute] : []),
    ...(matchingRedirect ? [matchingRedirect] : []),
    ...children,
  ];
};

export const buildMatchers = async (routes: Routes, tab?: Tab) => {
  try {
    return await routes
      .map(async (route) => buildMatcher(route, 'tab' in route ? route.tab : tab))
      .reduce(async (prev, next) => [...(await prev), ...(await next)], Promise.resolve([]));
  } catch {
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
  }
  return resolver(activatedRoute);
};

export const resolveRoute = (id: string | undefined, route: MatchingRoute): RouteData => {
  const resolved = Object.fromEntries(
    Object.entries(route.resolve ?? {}).map(([key, resolver]) => [
      key,
      resolve(resolver, {
        id,
        data: route.data ?? {},
        query: route.query,
        params: route.params,
        path: route.path,
        url: route.matchedPath,
        isExact: route.path === route.matchedPath,
        loading: true,
      }),
    ])
  );
  return {
    ...route.data,
    ...resolved,
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
        query: parse(search.slice(1)),
        path,
      };
      if (await guardRoute(route, routeInfo)) {
        if ('redirect' in route) {
          const redirect =
            typeof route.redirect === 'string' ? route.redirect : route.redirect(routeInfo);
          return matchRoute(matchers, `/${redirect}`);
        }
        if ('id' in route) {
          return {
            ...route,
            params: matched.params,
            query: parse(search.slice(1)),
            matchedPath: path,
          };
        }
      }
    }
  }

  return undefined;
};

export const normalizeLocationDescriptor = (to: LocationDescriptor): LocationDescriptorObject => {
  if (typeof to === 'string') {
    return normalizeLocationDescriptor(parsePath(to));
  }

  let { pathname } = to;

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
    pathname,
  };
};
