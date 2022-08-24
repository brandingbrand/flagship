import type { ExtractFailure, ExtractOk, Result } from './result';
import { isFailure, isOk, isResult, ok } from './result';

export const flatten = <OkType, FailureType>(
  results: ReadonlyArray<Result<OkType, FailureType>>
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

export const flattenRecord = <T extends Record<PropertyKey, Result<unknown, unknown>>>(
  results: T
): Result<{ [key in keyof T]: ExtractOk<T[key]> }, ExtractFailure<T[keyof T]>> => {
  type ReturnType = Result<{ [key in keyof T]: ExtractOk<T[key]> }, ExtractFailure<T[keyof T]>>;

  try {
    const entries = Object.entries(results).map(([key, result]) => {
      if (isOk(result)) {
        return [key, result as ExtractOk<T[typeof key]>] as const;
      }

      /*
        eslint-disable-next-line @typescript-eslint/no-throw-literal --
        This is used to short circuit the map in the event that a failure result is found.
      */
      throw result;
    });

    return ok(Object.fromEntries(entries)) as ReturnType;
  } catch (error) {
    if (isResult(error) && isFailure(error)) {
      return error as ReturnType;
    }

    throw error;
  }
};
