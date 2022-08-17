import { pipe } from '@brandingbrand/standard-compose';
import { flatMap, flatMapFailure } from '@brandingbrand/standard-result';

import { isCombinatorResult } from './combinator.guard';
import { combinateFail, combinateOk } from './combinator.result';
import type { CombinatorParserResult, CombinatorResult } from './combinator.types';

/**
 * Accepts either a `ParserResult` or `CombinatorResult`. If the input is a
 * `CombinatorResult`, returns that value. Otherwise, maps the `ParserResult`
 * to a `CombinatorResult`. This enables us to work with both types of
 * results in combinators.
 *
 * @param result is any `CombinatorResult` or `ParserResult`.
 * @return a `CombinatorResult`.
 */
export const toCombinatorResult = <T = unknown>(
  result: CombinatorParserResult<T>
): CombinatorResult<T, T> => {
  if (isCombinatorResult<T>(result)) {
    return result;
  }

  return pipe(
    result,
    flatMap(({ cursor, cursorEnd, input, value }) =>
      combinateOk<T, T>({
        cursor,
        cursorEnd,
        input,
        results: [result],
        value,
      })
    ),
    flatMapFailure(({ cursor, fatal, input }) =>
      combinateFail({ cursor, fatal, input, results: [result] })
    )
  );
};
