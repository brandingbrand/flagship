export const sortObject = <T extends Record<PropertyKey, unknown>>(unorderedObject: T): T =>
  Object.fromEntries(
    Object.entries(unorderedObject).sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
  ) as T;
