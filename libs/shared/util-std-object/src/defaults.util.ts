// Credit: Lodash - MIT

import type { Union } from 'ts-toolbelt';

/**
 * Assigns own and inherited enumerable string keyed properties of source
 * objects to the destination object for all destination properties that
 * resolve to `undefined`. Source objects are applied from left to right.
 * Once a property is set, additional values of the same property are ignored.
 *
 * **Note:** This method mutates `object`.
 *
 * @param object The destination object.
 * @param sources The source objects.
 * @returns Returns `object`.
 * @example
 *
 * defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 })
 * // => { 'a': 1, 'b': 2 }
 */
export const defaults = <T extends object, S extends object[]>(
  object: T,
  ...sources: S
): T & Union.IntersectOf<S[number]> => {
  for (const source of sources) {
    if (source !== null) {
      for (const key of Object.keys(source) as (keyof S[number])[]) {
        const value = object[key];

        if (
          value === undefined ||
          ((value as unknown) === Object.prototype[key as keyof typeof Object.prototype] &&
            !object.hasOwnProperty(key))
        ) {
          (object as S[number])[key] = (source as S[number])[key];
        }
      }
    }
  }

  return object as T & Union.IntersectOf<S[number]>;
};
