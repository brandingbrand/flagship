import type { Predicate, TypeGuard } from '@brandingbrand/standard-types';

import type { Option } from './option';
import { none, some } from './option';

export const fromTypeguard =
  <A, B extends A>(predicate: TypeGuard<A, B>): ((input: A) => Option<B>) =>
  (input) =>
    predicate(input) ? some(input) : none;

export const fromPredicate =
  <A>(predicate: Predicate<A>): ((input: A) => Option<A>) =>
  (input) =>
    predicate(input) ? some(input) : none;
