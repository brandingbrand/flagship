/**
 * Extracts the property names from a given object whose values are assignable to a given type
 *
 * Example:
 * interface MyObject {
 *  a: string;
 *  b: string;
 *  c: () => void;
 *  d: number;
 * }
 * type StringProperties = ExtractPropertyNames<MyObject, string>;
 *                     ^ = type StringProperties = 'a' | 'b'
 *
 * type NumberProperties = ExtractPropertyNames<MyObject, number>;
 *                     ^ = type NumberProperties = 'd'
 *
 */
export type ExtractPropertyNames<T, S> = {
  [K in keyof T]: T[K] extends S ? K : never;
}[keyof T];
