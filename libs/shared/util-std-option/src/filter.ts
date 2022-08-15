import type { Predicate, TypeGuard } from '@brandingbrand/standard-types';

import type { Option } from './option';
import { isSome, none } from './option';

export function filter<A, B extends A>(predicate: TypeGuard<A, B>): (input: Option<A>) => Option<B>;
/**
 *
 * @param predicate
 */
export function filter<A>(predicate: Predicate<A>): (input: Option<A>) => Option<A> {
  return (input) => {
    if (isSome(input)) {
      return predicate(input.value) ? input : none;
    }
    return input;
  };
}
