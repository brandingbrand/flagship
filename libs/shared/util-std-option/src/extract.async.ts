import { Lazy, MaybePromise } from '@brandingbrand/types-utility';
import { isNone, Option } from './option';

export const extractAsync =
  <Value, NoneValue>(onNone: Lazy<MaybePromise<NoneValue>>) =>
  async (input: MaybePromise<Option<Value>>): Promise<Value | NoneValue> => {
    const awaitedInput = await input;
    if (isNone(awaitedInput)) {
      return onNone();
    }
    return awaitedInput.value;
  };
