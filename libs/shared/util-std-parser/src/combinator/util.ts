import { flow, pipe } from '@brandingbrand/standard-compose';
import { mapFailure, mapOk } from '@brandingbrand/standard-result';

import type { ParserFailure, ParserOk, ParserResult } from '../parser';

import { isCombinatorFailure } from './guards';
import type {
  CombinatorFailure,
  CombinatorOk,
  CombinatorParserResults,
  CombinatorResult,
} from './types';

/**
 * A type safe utility to get the last element of a non-empty array of
 * `ParseResult` objects.
 *
 * @param results - A non-empty array of `ParseResult` values
 * @return The last result in the given array
 */
export const lastResult = (results: CombinatorParserResults): ParserResult =>
  results[results.length - 1] ?? results[0];

/**
 * Maps the given `ParseResult` into a `CombinatorResult`.
 *
 * @param result - Any `ParseResult` value
 * @return A CombinatorResult where the `results` array is populated with
 *         the result of the given `ParseResult` object.
 */
export const toCombinatorResult = (result: ParserResult): CombinatorResult =>
  pipe(
    result,
    mapFailure<ParserOk, ParserFailure, CombinatorFailure>(({ cursor, input }) => ({
      cursor,
      input,
      results: [result],
    })),
    mapOk<ParserOk, CombinatorOk, CombinatorFailure>(({ cursor, cursorEnd, input }) => ({
      cursor,
      cursorEnd,
      input,
      results: [result],
    }))
  );

/**
 * Given a `CombinatorOk`, returns a map function that merges the returned
 * `CombinatorResult` with the `CombinatorOk` regardless of success or failure.
 *
 * @param result - Any `CombinatorFailure` or `CombinatorOk` value
 * @return A function that takes a `CombinatorResult` and returns a merged
 *         `CombinatorResult`.
 */
export const concatCombinatorResult = (
  result: CombinatorFailure | CombinatorOk
): ((result: CombinatorResult) => CombinatorResult) =>
  flow(
    mapFailure(({ results }) => {
      /**
       * If the previous result is a failure, do not concat the new
       * result and return the unaltered previous result.
       */
      if (isCombinatorFailure(result)) {
        return result;
      }

      return {
        cursor: result.cursor,
        input: result.input,
        results: [...result.results, ...results] as CombinatorParserResults,
      };
    }),
    mapOk(({ cursor, cursorEnd, input, results }) => {
      /** See the comment in mapFailure above. */
      if (isCombinatorFailure(result)) {
        return result;
      }

      return {
        cursor,
        cursorEnd,
        input,
        results: [...result.results, ...results] as CombinatorParserResults,
      };
    })
  );

/**
 * Given a `CombinatorOk`, returns a function that accepts a `ParseResult`,
 * maps that result into a `CombinatorResult`, and merges that value with
 * the provided `CombinatorOk` value.
 *
 * @param result - Any `CombinatorFailure` or `CombinatorOk` value
 * @return A function that takes a `ParseResult` and returns a merged
 *         `CombinatorResult`.
 */
export const pushParseResult = (
  result: CombinatorFailure | CombinatorOk
): ((result: ParserResult) => CombinatorResult) =>
  flow(toCombinatorResult, concatCombinatorResult(result));
