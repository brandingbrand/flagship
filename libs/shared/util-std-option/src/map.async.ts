import type { MaybePromise } from '@brandingbrand/standard-types';

import type { Option } from './option';
import { isSome, some } from './option';

export const mapAsync =
  <InputType, OutputType>(mapFn: (input: InputType) => MaybePromise<OutputType>) =>
  async (input: MaybePromise<Option<InputType>>): Promise<Option<OutputType>> => {
    const awaitedInput = await input;
    if (isSome(awaitedInput)) {
      const result = await mapFn(awaitedInput.value);
      return some(result);
    }
    return awaitedInput;
  };
