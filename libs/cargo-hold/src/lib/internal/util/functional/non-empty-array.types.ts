export type NonEmptyArray<T> = {
  0: T;
} & T[];
