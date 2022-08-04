export type NonEmptyArray<T> = T[] & {
  0: T;
};
