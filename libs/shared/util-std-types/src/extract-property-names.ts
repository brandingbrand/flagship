export type ExtractPropertyNames<T, S> = NonNullable<
  {
    [K in keyof T]: T[K] extends S ? K : never;
  }[keyof T]
>;
