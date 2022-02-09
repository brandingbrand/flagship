import { isSome, Option, some } from './option';

export const map =
  <Input, Output>(mapFn: (input: Input) => Output) =>
  (input: Option<Input>): Option<Output> => {
    if (isSome(input)) {
      return some(mapFn(input.value));
    }
    return input;
  };
