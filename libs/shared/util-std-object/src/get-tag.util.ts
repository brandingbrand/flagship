// eslint-disable-next-line @typescript-eslint/unbound-method
const toString = Object.prototype.toString;

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param value The value to query.
 * @returns Returns the `toStringTag`.
 */
export const getTag = (value: unknown): string => {
  if (value === undefined) {
    return '[object Undefined]';
  }

  if (value === null) {
    return '[object Null]';
  }

  return toString.call(value);
};
