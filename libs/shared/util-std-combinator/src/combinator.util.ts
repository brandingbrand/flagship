import { pipe } from '@brandingbrand/standard-compose';
import type { Parser, ParserArgs } from '@brandingbrand/standard-parser';
import { parseFail, parseOk } from '@brandingbrand/standard-parser';
import {
  flatMap,
  flatMapFailure,
  isFailure,
  mapFailure,
  mapOk,
} from '@brandingbrand/standard-result';

import { combinateFail, combinateOk } from './combinator.result';
import type { CombinatorParserResults, CombinatorResult } from './combinator.types';

/**
 * Given a `Parser`, returns a `Combinator` that calls that parser and maps the
 * `ParserResult` to a `CombinatorResult`. This function can be used to initiate
 * a chain of `Combinators`.
 *
 * @param parser - Any `Parser`
 * @return A `Combinator`.
 */
export const runParser =
  <T>(parser: Parser<T>) =>
  (args: ParserArgs): CombinatorResult<T, T> =>
    pipe(
      args,
      parser,
      flatMapFailure((failure) => combinateFail<T>({ ...failure, results: [parseFail(failure)] })),
      flatMap((success) => combinateOk<T>({ ...success, results: [parseOk(success)] }))
    );

/**
 * Given a `CombinatorOk`, returns a map function that merges the returned
 * `CombinatorResult` with the `CombinatorOk` regardless of success or failure.
 *
 * @param prevResult - Any `CombinatorFailure` or `CombinatorOk` value
 * @return A function that takes a `CombinatorResult` and returns a merged
 *         `CombinatorResult`.
 */
export const concatCombinatorResult =
  <T>(prevResult: CombinatorResult<T>) =>
  (result: CombinatorResult<T>): CombinatorResult<T> => {
    /**
     * If the previous result is a failure, do not concat the new
     * result and return the unaltered previous result.
     */
    if (isFailure(prevResult)) {
      return prevResult;
    }

    return pipe(
      result,
      mapFailure(({ results }) => ({
        ...prevResult.ok,
        results: [...prevResult.ok.results, ...results] as CombinatorParserResults<T>,
      })),
      mapOk(({ cursorEnd, results }) => ({
        ...prevResult.ok,
        cursorEnd,
        results: [...prevResult.ok.results, ...results] as CombinatorParserResults<T>,
      }))
    );
  };
