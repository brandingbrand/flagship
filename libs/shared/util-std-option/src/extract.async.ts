import type { Lazy, MaybePromise } from '@brandingbrand/types-utility';

import type { Option } from './option';
import { isNone } from './option';

export const extractAsync =
  <Value, NoneValue>(onNone: Lazy<MaybePromise<NoneValue>>) =>
  async (input: MaybePromise<Option<Value>>): Promise<NoneValue | Value> => {
    const awaitedInput = await input;
    if (isNone(awaitedInput)) {
      return onNone();
    }
    return awaitedInput.value;
  };
