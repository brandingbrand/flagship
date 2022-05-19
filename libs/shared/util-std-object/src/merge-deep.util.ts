import type { O } from 'ts-toolbelt';

export const mergeDeep = <T extends object[]>(...objects: T): O.MergeAll<object, T> => {
  const isObject = (obj: unknown): obj is Record<string, unknown> =>
    Boolean(obj && typeof obj === 'object');

  const deepMergeInner = (target: Record<string, unknown>, source: Record<string, unknown>) => {
    for (const key of Object.keys(source)) {
      const targetValue = target[key];
      const sourceValue = source[key];

      if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
        target[key] = targetValue.concat(sourceValue);
      } else if (isObject(targetValue) && isObject(sourceValue)) {
        target[key] = deepMergeInner({ ...targetValue }, sourceValue);
      } else {
        target[key] = sourceValue;
      }
    }

    return target;
  };

  if (objects.length < 2) {
    throw new Error('deepMerge: this function expects at least 2 objects to be provided');
  }

  if (objects.some((object) => !isObject(object))) {
    throw new Error('deepMerge: all values should be of type "object"');
  }

  const target: Record<string, unknown> = {};
  let source: Record<string, unknown> | undefined;

  while ((source = objects.shift() as Record<string, unknown> | undefined)) {
    deepMergeInner(target, source);
  }

  return target as O.MergeAll<object, T>;
};
