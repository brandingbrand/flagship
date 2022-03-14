// Credit: Lodash - MIT

import type { Union } from 'ts-toolbelt';

/**
 * This method is like `defaults` except that it recursively assigns
 * default properties.
 *
 * **Note:** This method mutates `object`.
 *
 * @param object The destination object.
 * @param sources The source objects.
 * @returns  Returns `object`.
 * @example
 *
 * defaultsDeep({ 'a': { 'b': 2 } }, { 'a': { 'b': 1, 'c': 3 } })
 * // => { 'a': { 'b': 2, 'c': 3 } }
 */
export const defaultsDeep = <T extends object, S extends object[]>(
  object: T,
  ...sources: S
): T & Union.IntersectOf<S[number]> => {
  for (const source of sources) {
    if (source !== null) {
      for (const key of Object.keys(source) as (keyof S[number])[]) {
        const currentValue = (object as S[number])[key];
        const updatedValue = (source as S[number])[key];

        if (typeof updatedValue === 'object') {
          (object as S[number])[key] = defaultsDeep(
            currentValue as unknown as object,
            updatedValue as unknown as object
          ) as unknown as typeof currentValue;
        } else {
          if (
            currentValue === undefined ||
            ((currentValue as unknown) === Object.prototype[key as keyof typeof Object.prototype] &&
              !object.hasOwnProperty(key))
          ) {
            (object as S[number])[key] = updatedValue;
          }
        }
      }
    }
  }

  return object as T & Union.IntersectOf<S[number]>;
};
