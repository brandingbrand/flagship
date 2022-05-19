import type { Lazy } from '@brandingbrand/types-utility';

import type { Option } from './option';
import { isNone } from './option';

export const extract =
  <Value, NoneValue>(onNone: Lazy<NoneValue>) =>
  (input: Option<Value>): NoneValue | Value => {
    if (isNone(input)) {
      return onNone();
    }
    return input.value;
  };
