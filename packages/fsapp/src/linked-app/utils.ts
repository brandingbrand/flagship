import { Route } from './types';

import loadable from '@loadable/component';
import { fromPairs } from 'lodash-es';

export const StaticImplements = <T>() => <U extends T>(_constructor: U) => {
  return;
};

export const isDefined = <T>(value: T | undefined): value is T => value !== undefined;

export const buildPath = (route: Route, prefix?: string) => {
  const path = route.path !== undefined ? `${prefix ?? ''}/${route.path ?? ''}` : prefix;
  const id = path ?? `${prefix ?? ''}/undefined`;
  return { id, path };
};

export const lazyComponent = loadable;

export const promisedEntries = async (data: Record<string, unknown>) => {
  return fromPairs(
    await Promise.all(
      Object.entries(data).map(async ([key, entry]) => {
        return [key, await Promise.resolve(entry)];
      })
    )
  );
};
