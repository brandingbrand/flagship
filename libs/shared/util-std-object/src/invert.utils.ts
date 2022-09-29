export const invert = <T extends PropertyKey, K extends PropertyKey>(
  object: Record<K, T>
): Record<T, K> =>
  Object.fromEntries(
    Object.entries(object).map(([key, value]) => [value as T, key as K])
  ) as Record<T, K>;
