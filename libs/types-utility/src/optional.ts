/**
 * Make one or more properties of an object optional
 *
 * @example
 * type Foo = {
 *  bar: string;
 *  baz: number;
 * };
 *
 * type OptionalFoo = Optional<Foo, 'bar'>; // { bar?: string; baz: number }
 */
export type Optional<T extends object, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
