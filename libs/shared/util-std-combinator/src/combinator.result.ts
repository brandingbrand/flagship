import type { WithCursor } from '@brandingbrand/standard-parser';
import { fail, ok } from '@brandingbrand/standard-result';

import { brandCombinator } from './combinator.brand';
import type {
  CombinatorFailure,
  CombinatorFailureFields,
  CombinatorOk,
  CombinatorOkFields,
} from './combinator.types';

export const combinateFail = <T = unknown>({
  cursor = 0,
  fatal,
  input,
  results,
}: Omit<CombinatorFailureFields<T>, 'cursor'> & Partial<WithCursor>): CombinatorFailure<T> =>
  typeof fatal === 'string'
    ? fail(brandCombinator({ cursor, fatal, input, results }))
    : fail(brandCombinator({ cursor, input, results }));

export const combinateOk = <T = unknown, V = T>({
  cursor = 0,
  cursorEnd,
  input,
  results,
  value,
}: Omit<CombinatorOkFields<T, V>, 'cursor'> & Partial<WithCursor>): CombinatorOk<T, V> =>
  ok(
    brandCombinator({
      cursor,
      cursorEnd,
      input,
      results,
      value,
    })
  );
