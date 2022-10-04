export const omit = <T extends object, K extends PropertyKey[]>(
  object: T | null | undefined,
  ...paths: K
): Pick<T, Exclude<keyof T, K[number]>> =>
  Object.fromEntries(Object.entries(object ?? {}).filter(([key]) => !(key in paths))) as Pick<
    T,
    Exclude<keyof T, K[number]>
  >;
