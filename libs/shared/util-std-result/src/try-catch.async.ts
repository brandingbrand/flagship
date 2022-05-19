import type { Lazy, MaybePromise } from '@brandingbrand/types-utility';

import type { Result } from './result';
import { fail, ok } from './result';

export const tryCatchAsync = async <OkType, FailureType>(
  throwingFn: Lazy<MaybePromise<OkType>>
): Promise<Result<OkType, FailureType>> => {
  try {
    const result = await throwingFn();
    return ok(result);
  } catch (error) {
    return fail(error as FailureType);
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
    } catch (error) {
      return fail(error as FailureType);
    }
  };
