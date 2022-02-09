import { fail, isFailure, isOk, ok, Result } from './result';

export const mapOk =
  <InputOkType, OutputOkType, FailureType>(mapFn: (input: InputOkType) => OutputOkType) =>
  (input: Result<InputOkType, FailureType>): Result<OutputOkType, FailureType> => {
    if (isOk(input)) {
      return ok(mapFn(input.ok));
    }
    return input;
  };

export const mapFailure =
  <OkType, InputFailureType, OutputFailureType>(
    mapFn: (input: InputFailureType) => OutputFailureType
  ) =>
  (input: Result<OkType, InputFailureType>) => {
    if (isFailure(input)) {
      return fail(mapFn(input.failure));
    }
    return input;
  };
