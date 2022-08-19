import type { Result } from './result';
import { isFailure, ok } from './result';

export const flatten = <OkType, FailureType>(
  results: Array<Result<OkType, FailureType>>
): Result<OkType[], FailureType> =>
  // eslint-disable-next-line unicorn/no-array-reduce -- Isolated
  results.reduce<Result<OkType[], FailureType>>((aggregate, value) => {
    if (isFailure(aggregate)) {
      return aggregate;
    }

    if (isFailure(value)) {
      return value;
    }

    return ok([...aggregate.ok, value.ok]);
  }, ok([]));
