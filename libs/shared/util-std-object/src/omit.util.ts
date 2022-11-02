export const omit = <T extends object, K extends PropertyKey[]>(
  object: T | null | undefined,
  ...paths: K
): Pick<T, Exclude<keyof T, K[number]>> =>
  (object
    ? Object.fromEntries(
        (Reflect.ownKeys(object) as Array<keyof T>)
          .filter((key) => !paths.includes(key))
          .map((key) => [key, object[key]])
      )
    : {}) as Pick<T, Exclude<keyof T, K[number]>>;
