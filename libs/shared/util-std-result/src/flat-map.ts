import { isFailure, isOk, Result } from './result';

export const flatMap =
  <InputOkType, OutputOkType, FailureType>(
    flatMapFn: (input: InputOkType) => Result<OutputOkType, FailureType>
  ) =>
  (input: Result<InputOkType, FailureType>): Result<OutputOkType, FailureType> => {
    if (isOk(input)) {
      return flatMapFn(input.ok);
    }
    return input;
  };

export const flatMapFailure =
  <OkType, InputFailureType, OutputFailureType>(
    flatMapFn: (input: InputFailureType) => Result<OkType, OutputFailureType>
  ) =>
  (input: Result<OkType, InputFailureType>): Result<OkType, OutputFailureType> => {
    if (isFailure(input)) {
      return flatMapFn(input.failure);
    }
    return input;
  };
