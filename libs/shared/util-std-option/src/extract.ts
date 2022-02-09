import { Lazy } from '@brandingbrand/types-utility';
import { isNone, Option } from './option';

export const extract =
  <Value, NoneValue>(onNone: Lazy<NoneValue>) =>
  (input: Option<Value>): Value | NoneValue => {
    if (isNone(input)) {
      return onNone();
    }
    return input.value;
  };
