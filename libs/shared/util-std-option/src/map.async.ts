import { MaybePromise } from '@brandingbrand/types-utility';
import { isSome, Option, some } from './option';

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
