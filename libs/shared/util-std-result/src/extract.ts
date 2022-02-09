import { isOk, Result } from './result';

export const extract =
  <OkType, FailureType, Output>(
    onOk: (input: OkType) => Output,
    onFail: (input: FailureType) => Output
  ) =>
  (input: Result<OkType, FailureType>): Output => {
    if (isOk(input)) {
      return onOk(input.ok);
    }
    return onFail(input.failure);
  };
