import { Combinable, CombinableWithEmpty } from './types';
import type { NonEmptyArray } from '@brandingbrand/standard-array';

export const combine =
  <Element>(combinable: Combinable<Element>) =>
  (input: NonEmptyArray<Element>): Element => {
    if (input.length === 1) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return input[0]!;
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return input.slice(1).reduce((accum, curr) => combinable.combine(accum, curr), input[0]!);
  };

export const combineWithEmpty =
  <Element>(combinable: CombinableWithEmpty<Element>) =>
  (input: Element[]): Element => {
    if (!input.length) {
      return combinable.empty;
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return input.slice(1).reduce((accum, curr) => combinable.combine(accum, curr), input[0]!);
  };
