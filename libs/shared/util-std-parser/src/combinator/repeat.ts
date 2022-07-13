import { flow, pipe } from '@brandingbrand/standard-compose';
import { fail, flatMap, flatMapFailure, isOk, mapOk, ok } from '@brandingbrand/standard-result';

import type { Parser } from '../parser';

import { run, runNext } from './run';
import type { Combinator, CombinatorConstructor, CombinatorParserResults } from './types';
import { concatCombinatorResult, lastResult } from './util';

/**
 * Given a `Parser`, repeatedly runs that parser until it fails.
 *
 * @param parser - Any `Parser`
 * @return A `Combinator` that succeeds as long as the parser succeeds
 *         a single time.
 */
export const repeat: Combinator<[Parser]> = (parser) =>
  flow(
    run(parser),
    runNext(repeat(parser)),
    flatMapFailure((result) => {
      if (!result.results.some(isOk)) {
        return fail(result);
      }

      /** Remove the last `ParseResult` from the array (this will always be a `Failure`). */
      result.results.pop();

      const last = lastResult(result.results);

      if (isOk(last)) {
        return ok({ ...result, cursorEnd: last.ok.cursorEnd });
      }

      return fail(result);
    })
  );

/**
 * Given a `number` (`max`), returns a `Combinator` that repeatedly runs a `Parser`
 * until it either fails or succeeds the given `max` times.
 *
 * @param max - The maximum number of times for the parser to repeat. Note:
 *              The parser will *always* be run at least once (`max` will be
 *              treated as `1` even if the provided argument is less than `1`).
 * @return A `Combinator`.
 */
export const repeatUntilMax =
  (max: number): Combinator<[Parser]> =>
  (parser) =>
    flow(
      run(parser),
      flatMap((success) => {
        if (max <= 1) {
          return ok(success);
        }

        return pipe(
          { cursor: success.cursorEnd, input: success.input },
          /**
           * Recursively calls itself reducing the `max` by 1.
           * Because we only do this recursion when the result is
           * `Ok`, this will continue repeating until `max` is either
           * 1 or the provided parser fails.
           */
          repeatUntilMax(max - 1)(parser),
          concatCombinatorResult(success)
        );
      })
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
export const repeatUntilTerminator: CombinatorConstructor<[Parser]> = (terminator) => (parser) =>
  flow(
    run(parser),
    flatMap((success) =>
      pipe(
        { cursor: success.cursorEnd, input: success.input },
        run(terminator),
        flatMapFailure(() =>
          pipe(
            {
              cursor: success.cursorEnd,
              input: success.input,
            },
            repeatUntilTerminator(terminator)(parser),
            concatCombinatorResult(success)
          )
        ),
        mapOk(({ results }) => ({
          ...success,
          results: [...success.results, ...results] as CombinatorParserResults,
        }))
      )
    )
  );
