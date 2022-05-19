// eslint-disable-next-line @typescript-eslint/unbound-method
const { toString } = Object.prototype;

/**
 * Gets the `toStringTag` of `value`.
 *
 * @param value The value to query.
 * @return Returns the `toStringTag`.
 * @private
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
