import { flow, pipe } from '@brandingbrand/standard-compose';
import { flatMap } from '@brandingbrand/standard-result';

import type { Parser } from '../parser';

import type { Combinator, CombinatorResult } from './types';
import { concatCombinatorResult, toCombinatorResult } from './util';

/**
 * Given a `Parser`, returns a `Combinator` that calls that parser and maps the
 * `ParserResult` to a `CombinatorResult`. This function can be used to initiate
 * a chain of `Combinators`.
 *
 * @param parser - Any `Parser`
 * @return A `Combinator`.
 */
export const run: Combinator<[Parser]> = (parser) => flow(parser, toCombinatorResult);

/**
 * Given a `Parser`, returns a function that accepts a `CombinatorResult`,
 * calls the given `Parser` with `cursor` and `input` args derived from the
 * given previous `CombinatorResult`, and merges those results.
 *
 * @param parser - Any `Parser`
 * @return A function
 */
export const runNext = (parser: Parser): ((result: CombinatorResult) => CombinatorResult) =>
  flow(
    flatMap((result) =>
      pipe(
        { cursor: result.cursorEnd, input: result.input },
        run(parser),
        concatCombinatorResult(result)
      )
    )
  );
