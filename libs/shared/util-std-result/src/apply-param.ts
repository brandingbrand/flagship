import { Failure } from '.';
import { isOk, ok, Result } from './result';

export const applyUnwrappedParams =
  <Params extends unknown[], OkType, FailureType>(...params: Params) =>
  (fnToApply: Result<(...params: Params) => OkType, FailureType>): Result<OkType, FailureType> => {
    if (isOk(fnToApply)) {
      return ok(fnToApply.ok(...params));
    }
    return fnToApply;
  };

export const applyParam =
  <Param, FailureType>(param: Result<Param, FailureType>) =>
  <OkType>(
    fnToApply: Result<(param: Param) => OkType, FailureType>
  ): Result<OkType, FailureType> => {
    if (isOk(fnToApply) && isOk(param)) {
      return ok(fnToApply.ok(param.ok));
    }
    if (isOk(param)) {
      return fnToApply as Failure<FailureType>;
    }
    return param;
  };
