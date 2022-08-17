import type { MaybePromise } from '@brandingbrand/standard-types';

import type { Result } from './result';
import { isOk } from './result';

export const extractAsync =
  <OkType, FailureType, OutputType>(
    onOk: (input: OkType) => MaybePromise<OutputType>,
    onFail: (input: FailureType) => MaybePromise<OutputType>
  ) =>
  async (input: MaybePromise<Result<OkType, FailureType>>): Promise<OutputType> => {
    const awaitedInput = await input;
    if (isOk(awaitedInput)) {
      return onOk(awaitedInput.ok);
    }
    return onFail(awaitedInput.failure);
  };
