import type {
  WithCursor,
  WithCursorEnd,
  WithFatalError,
  WithInput,
  WithValue,
} from '@brandingbrand/standard-parser';
import { fail, ok } from '@brandingbrand/standard-result';

import { brandCombinator } from './combinator.brand';
import type { CombinatorFailure, CombinatorOk, WithResults } from './combinator.types';

export const combinateFail: (
  value: Partial<WithCursor & WithFatalError> & WithInput & WithResults
) => CombinatorFailure = ({ cursor = 0, input, results, ...value }) =>
  fail(brandCombinator({ ...value, cursor, input, results }));

export const combinateOk: <T, V = T>(
  args: Partial<WithCursor> & WithCursorEnd & WithInput & WithResults & WithValue<V>
) => CombinatorOk<T, V> = ({ cursor = 0, cursorEnd, input, results, value, ...success }) =>
  ok(brandCombinator({ ...success, cursor, cursorEnd, input, results, value }));
