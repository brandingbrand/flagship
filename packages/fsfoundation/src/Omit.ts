/**
 * A type including all members of T except for K.
 */
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
