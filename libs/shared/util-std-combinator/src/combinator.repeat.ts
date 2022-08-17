import { pipe } from '@brandingbrand/standard-compose';
import type { ParserArgs } from '@brandingbrand/standard-parser';
import { flatMap, flatMapFailure } from '@brandingbrand/standard-result';

import { many } from './combinator.many';
import { combinateOk } from './combinator.result';
import type {
  CombinatorOk,
  CombinatorParameter,
  CombinatorParser,
  CombinatorParserResults,
  ManyCombinator,
} from './combinator.types';
import { toCombinatorResult } from './combinator.util';

/**
 * Given a `Parser`, repeatedly runs that parser until it fails.
 *
 * @param parser - Any `Parser`
 * @return A `Combinator` that succeeds as long as the parser succeeds
 *         a single time.
 */
export const repeat =
  <T>(parser: CombinatorParameter<T>): CombinatorParser<T, T[]> =>
  ({ cursor = 0, input }) =>
    pipe(
      { cursor, input },
      many(parser),
      flatMap((success) =>
        pipe(
          { cursor: success.cursorEnd, input },
          repeat(parser),
          flatMap(({ cursorEnd, results, value }) =>
            combinateOk({
              ...success,
              cursorEnd,
              results: [...success.results, ...results] as unknown as CombinatorParserResults<T>,
              value: [...success.value, ...value],
            })
          ),
          flatMapFailure(() => combinateOk(success))
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
  <T>(terminator: CombinatorParameter): ManyCombinator<T> =>
  (parser) =>
  (args: CombinatorOk<T, T[]>['ok'] | ParserArgs) =>
    pipe(
      args,
      many(parser),
      flatMap((success) =>
        pipe(
          terminator({ cursor: success.cursorEnd, input: args.input }),
          toCombinatorResult,
          flatMap(() => combinateOk({ ...success, cursor: args.cursor })),
          flatMapFailure(() =>
            pipe(
              { ...success, cursor: args.cursor },
              repeatUntilTerminator<T>(terminator)(parser),
              flatMapFailure(() => combinateOk({ ...success, cursor: args.cursor }))
            )
          )
        )
      )
    );
