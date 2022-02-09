export type Predicate<T> = (value: T) => boolean;
export type TypeGuard<A, B extends A> = (value: A) => value is B;

export type Lazy<T> = () => T;
