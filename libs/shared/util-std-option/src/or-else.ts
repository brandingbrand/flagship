import { isNone, Option } from './option';

export const orElse =
  <T>(alternative: () => Option<T>) =>
  (input: Option<T>): Option<T> => {
    if (isNone(input)) {
      return alternative();
    }
    return input;
  };
