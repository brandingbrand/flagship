import { MaybePromise } from '@brandingbrand/types-utility';
import { isFailure, isOk, Result } from './result';

export const flatMapAsync =
  <InputOkType, OutputOkType, FailureType>(
    flatMapFn: (input: InputOkType) => MaybePromise<Result<OutputOkType, FailureType>>
  ) =>
  async (
    input: MaybePromise<Result<InputOkType, FailureType>>
  ): Promise<Result<OutputOkType, FailureType>> => {
    const awaitedInput = await input;
    if (isOk(awaitedInput)) {
      return flatMapFn(awaitedInput.ok);
    }
    return awaitedInput;
  };

export const flatMapFailureAsync =
  <OkType, InputFailureType, OutputFailureType>(
    flatMapFn: (input: InputFailureType) => MaybePromise<Result<OkType, OutputFailureType>>
  ) =>
  async (
    input: MaybePromise<Result<OkType, InputFailureType>>
  ): Promise<Result<OkType, OutputFailureType>> => {
    const awaitedInput = await input;
    if (isFailure(awaitedInput)) {
      return flatMapFn(awaitedInput.failure);
    }
    return awaitedInput;
  };
