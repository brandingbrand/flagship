import { Lazy, MaybePromise } from '@brandingbrand/types-utility';
import { fail, ok, Result } from './result';

export const tryCatchAsync = async <OkType, FailureType>(
  throwingFn: Lazy<MaybePromise<OkType>>
): Promise<Result<OkType, FailureType>> => {
  try {
    const result = await throwingFn();
    return ok(result);
  } catch (e) {
    return fail(e as FailureType);
  }
};

export const withTryCatchAsync =
  async <Params extends unknown[], OkType, FailureType>(
    throwingFn: (...params: Params) => MaybePromise<OkType>
  ) =>
  async (...params: Params): Promise<Result<OkType, FailureType>> => {
    try {
      const result = await throwingFn(...params);
      return ok(result);
    } catch (e) {
      return fail(e as FailureType);
    }
  };
