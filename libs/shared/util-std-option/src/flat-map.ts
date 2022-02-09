import { isSome, Option } from './option';

export const flatMap =
  <Input, Output>(flatMapFn: (input: Input) => Option<Output>) =>
  (input: Option<Input>): Option<Output> => {
    if (isSome(input)) {
      return flatMapFn(input.value);
    }
    return input;
  };
