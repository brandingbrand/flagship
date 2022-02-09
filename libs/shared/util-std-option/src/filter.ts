import { Predicate, TypeGuard } from '@brandingbrand/types-utility';
import { isSome, none, Option } from './option';

export function filter<A, B extends A>(predicate: TypeGuard<A, B>): (input: Option<A>) => Option<B>;
export function filter<A>(predicate: Predicate<A>): (input: Option<A>) => Option<A> {
  return (input) => {
    if (isSome(input)) {
      return predicate(input.value) ? input : none;
    }
    return input;
  };
}
