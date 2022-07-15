import { uniqueId } from 'lodash';

import type { Route, RouteCollection } from './router';

export const StaticImplements =
  <T,>() =>
  <U extends T>(_constructor: U) => {};

export const isDefined = <T,>(value: T | undefined): value is T => value !== undefined;

const pathFromRoute = (route: Route, prefix?: string) =>
  route.path !== undefined
    ? `${prefix?.replace(/\/$/, '') ?? ''}/${route.path.replace(/^\//, '') ?? ''}`
    : prefix ?? '/';

export const buildPath = (route: Route | RouteCollection, prefix?: string) => {
  const path = pathFromRoute(route, prefix);

  const id =
    !('path' in route) || route.path === undefined
      ? uniqueId('route')
      : uniqueId(path || `${prefix ?? ''}/undefined`);

  return { id, path };
};

export const promisedEntries = async (data: Record<string, unknown>) =>
  Object.fromEntries(
    await Promise.all(
      Object.entries(data).map(async ([key, entry]) => [key, await Promise.resolve(entry)])
    )
  );

export type Mutable<T> = { -readonly [P in keyof T]?: T[P] };
