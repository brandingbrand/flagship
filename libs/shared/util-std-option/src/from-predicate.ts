import type { Predicate, TypeGuard } from '@brandingbrand/types-utility';
import { none, Option, some } from './option';

export function fromPredicate<A, B extends A>(predicate: TypeGuard<A, B>): (input: A) => Option<B>;
export function fromPredicate<A>(predicate: Predicate<A>): (input: A) => Option<A> {
  return (input) => (predicate(input) ? some(input) : none);
}
