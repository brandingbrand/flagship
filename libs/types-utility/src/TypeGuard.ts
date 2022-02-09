export type TypeGuard<A, B extends A> = (value: A) => value is B;
