import type { Lazy, Predicate, TypeGuard } from '@brandingbrand/types-utility';
import { fail, ok, Result } from './result';

export function fromPredicate<A, B extends A, FailureType>(
  predicate: TypeGuard<A, B>,
  onFail: Lazy<FailureType>
): (input: A) => Result<B, FailureType>;
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
