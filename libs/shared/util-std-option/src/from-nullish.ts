import { none, Option, some } from './option';

export const fromNullish = <Value>(value: Value): Option<NonNullable<Value>> => {
  if (value === null || value === undefined) {
    return none;
  }
  return some(value as NonNullable<Value>);
};
