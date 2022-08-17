import type { Result } from './result';
import { isOk } from './result';

export const extract =
  <OkType, FailureType, OutputType>(
    onOk: (input: OkType) => OutputType,
    onFail: (input: FailureType) => OutputType
  ) =>
  (input: Result<OkType, FailureType>): OutputType => {
    if (isOk(input)) {
      return onOk(input.ok);
    }
    return onFail(input.failure);
  };
