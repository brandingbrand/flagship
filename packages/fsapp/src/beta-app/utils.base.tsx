import type { Dictionary } from '@brandingbrand/fsfoundation';
import type { Route } from './router';

import loadable from '@loadable/component';
import { fromPairs } from 'lodash-es';

export const StaticImplements = <T extends any>() => <U extends T>(_constructor: U) => {
  return;
};

export const isDefined = <T extends any>(value: T | undefined): value is T => value !== undefined;

export const buildPath = (route: Route, prefix?: string) => {
  const path =
    route.path !== undefined
      ? `${prefix?.replace(/\/$/, '') ?? ''}/${route.path?.replace(/^\//, '') ?? ''}`
      : prefix;
  const id = path || `${prefix ?? ''}/undefined`;
  return { id, path };
};

export const lazyComponent = loadable;

export const promisedEntries = async (data: Dictionary<unknown>) => {
  return fromPairs(
    await Promise.all(
      Object.entries(data).map(async ([key, entry]) => {
        return [key, await Promise.resolve(entry)];
      })
    )
  );
};

export type Mutable<T> = { -readonly [P in keyof T]?: T[P] };
