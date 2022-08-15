import type { Lazy } from '@brandingbrand/standard-types';

import type { Result } from './result';
import { fail, ok } from './result';

export const tryCatch = <OkType, FailureType>(
  throwingFn: Lazy<OkType>
): Result<OkType, FailureType> => {
  try {
    return ok(throwingFn());
  } catch (error) {
    return fail(error as FailureType);
  }
};

export const withTryCatch =
  <Params extends unknown[], OkType, FailureType>(throwingFn: (...params: Params) => OkType) =>
  (...params: Params): Result<OkType, FailureType> => {
    try {
      return ok(throwingFn(...params));
    } catch (error) {
      return fail(error as FailureType);
    }
  };
