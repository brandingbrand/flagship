import type { Result } from './result';
import { isFailure, isOk } from './result';

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
  <OutputOkType, InputFailureType, OutputFailureType>(
    flatMapFn: (input: InputFailureType) => Result<OutputOkType, OutputFailureType>
  ) =>
  <InputOkType>(
    input: Result<InputOkType, InputFailureType>
  ): Result<
    OutputOkType extends unknown ? InputOkType : InputOkType | OutputOkType,
    OutputFailureType
  > => {
    type ResultType = Result<
      OutputOkType extends unknown ? InputOkType : InputOkType | OutputOkType,
      OutputFailureType
    >;

    if (isFailure(input)) {
      return flatMapFn(input.failure) as ResultType;
    }

    return input as ResultType;
  };
