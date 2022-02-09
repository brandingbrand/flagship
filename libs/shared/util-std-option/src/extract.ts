import { isNone, Option } from './option';

export const extract =
  <Value, NoneValue>(onNone: () => NoneValue) =>
  (input: Option<Value>): Value | NoneValue => {
    if (isNone(input)) {
      return onNone();
    }
    return input.value;
  };
