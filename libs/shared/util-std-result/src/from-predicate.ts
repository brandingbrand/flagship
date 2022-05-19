import type { Lazy, Predicate, TypeGuard } from '@brandingbrand/types-utility';

import type { Result } from './result';
import { fail, ok } from './result';

export function fromPredicate<A, B extends A, FailureType>(
  predicate: TypeGuard<A, B>,
  onFail: Lazy<FailureType>
): (input: A) => Result<B, FailureType>;
/**
 *
 * @param predicate
 * @param onFail
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function fromPredicate<A, FailureType>(
  predicate: Predicate<A>,
  onFail: () => FailureType
): (input: A) => Result<A, FailureType> {
  return (input) => {
    const result = predicate(input);
    if (!result) {
      return fail(onFail());
    }
    return ok(input);
  };
}
