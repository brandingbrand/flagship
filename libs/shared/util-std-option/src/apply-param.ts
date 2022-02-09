import { isSome, none, Option, some } from './option';

export const applyUnwrappedParams =
  <Params extends unknown[]>(...params: Params) =>
  <T>(fnToApply: Option<(...params: Params) => T>): Option<T> => {
    if (isSome(fnToApply)) {
      return some(fnToApply.value(...params));
    }
    return fnToApply;
  };

export const applyParam =
  <Param>(param: Option<Param>) =>
  <T>(fnToApply: Option<(param: Param) => T>): Option<T> => {
    if (isSome(fnToApply) && isSome(param)) {
      return some(fnToApply.value(param.value));
    }
    return none;
  };
