import { isOk, ok, Result } from './result';

export const applyParam =
  <Params extends unknown[], OkType, FailureType>(...params: Params) =>
  (fnToApply: Result<(...params: Params) => OkType, FailureType>): Result<OkType, FailureType> => {
    if (isOk(fnToApply)) {
      return ok(fnToApply.ok(...params));
    }
    return fnToApply;
  };
