import { pipe } from '@brandingbrand/standard-compose';
import type { Parser, ParserArgs } from '@brandingbrand/standard-parser';
import { flatMap, flatMapFailure } from '@brandingbrand/standard-result';

import { many } from './combinator.many';
import { combinateOk } from './combinator.result';
import type { CombinatorParserResults, CombinatorResult } from './combinator.types';
import { toCombinator } from './combinator.util';

/**
 * Given a `Parser`, repeatedly runs that parser until it fails.
 *
 * @param parser - Any `Parser`
 * @return A `Combinator` that succeeds as long as the parser succeeds
 *         a single time.
 */
export const repeat =
  <T>(parser: Parser<T>) =>
  ({ cursor = 0, input }: ParserArgs): CombinatorResult<T, T[]> =>
    pipe(
      { cursor, input },
      many<T>(parser, parser),
      flatMap((success) =>
        pipe(
          { cursor: success.cursorEnd, input },
          repeat(parser),
          flatMap(({ cursorEnd, results, value }) =>
            combinateOk({
              ...success,
              cursorEnd,
              results: [...success.results, ...results] as CombinatorParserResults,
              value: [...success.value, ...value] as T[],
            })
          ),
          flatMapFailure(({ results }) =>
            combinateOk({
              ...success,
              results: [...success.results, ...results] as CombinatorParserResults,
            })
          )
        )
      )
    );

/**
 * Given a `Parser` (`terminator`), returns a `Combinator` that repeatedly runs a
 * `Parser` until it either fails or the `terminator` succeeds. Note: The `Parser`
 * passed to the constructed function must succeed at least once before the
 * `terminator` will be attempted.
 *
 * @param terminator - Any `Parser`.
 * @return A `Combinator`.
 */
export const repeatUntilTerminator =
  <T>(terminator: Parser<T>) =>
  (parser: Parser<T>) =>
  ({ cursor = 0, input }: ParserArgs): CombinatorResult<T, T[]> =>
    pipe(
      { cursor, input },
      many<T>(parser),
      flatMap((success) =>
        pipe(
          { cursor: success.cursorEnd, input },
          toCombinator(terminator),
          flatMap(({ results }) =>
            combinateOk<T, T[]>({
              ...success,
              results: [...success.results, ...results] as CombinatorParserResults,
            })
          ),
          flatMapFailure(() =>
            pipe({ cursor: success.cursorEnd, input }, repeatUntilTerminator(terminator)(parser))
          )
        )
      )
    );
