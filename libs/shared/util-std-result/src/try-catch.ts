import type { Lazy } from '@brandingbrand/standard-compose';
import { fail, ok, Result } from './result';

export const tryCatch = <OkType, FailureType>(
  throwingFn: Lazy<OkType>
): Result<OkType, FailureType> => {
  try {
    return ok(throwingFn());
  } catch (e) {
    return fail(e as FailureType);
  }
};

export const withTryCatch =
  <Params extends unknown[], OkType, FailureType>(throwingFn: (...params: Params) => OkType) =>
  (...params: Params): Result<OkType, FailureType> => {
    try {
      return ok(throwingFn(...params));
    } catch (e) {
      return fail(e as FailureType);
    }
  };
