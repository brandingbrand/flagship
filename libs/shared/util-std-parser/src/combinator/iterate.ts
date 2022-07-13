import { flow, pipe } from '@brandingbrand/standard-compose';
import { fail, flatMap, flatMapFailure, ok } from '@brandingbrand/standard-result';

import type { Parsers } from '../parser';

import { run } from './run';
import type { Combinator } from './types';
import { concatCombinatorResult } from './util';

/**
 * Given any number of parsers as params, iterates through them
 * sequentially until either all parsers have run successfully or
 * any parser fails. The `cursorEnd` value of the previous parser
 * is used as the `cursor` value for the subsequent parser.
 *
 * @param parsers - Any parser functions
 * @return A CombinatorResult
 */
export const iterate: Combinator = (...parsers) =>
  flow(
    run(parsers[0]),
    flatMap((success) => {
      /** Succeeds by default when we've called all given parsers. */
      if (parsers.length === 1) {
        return ok(success);
      }

      return pipe(
        success,
        /**
         * Recursively calls itself with the remaining parsers until a parser has failed.
         * We've checked the length above so there will always be a fn at index 1.
         */
        iterate(...(parsers.slice(1) as Parsers)),
        concatCombinatorResult(success)
      );
    })
  );

/**
 * Given any number of parsers as params, iterates through them
 * sequentially until any one parser succeeds. The `cursor` value
 * passed to each parser remains the same throughout.
 *
 * @param parsers - Any parser functions
 * @return A CombinatorResult
 */
export const iterateUntilOk: Combinator = (...parsers) =>
  flow(
    run(parsers[0]),
    /**
     * We only need to map failures. Any successful result will
     * be returned immediately, and because of the recursion below
     * the successful result will be pushed to the results array.
     */
    flatMapFailure((failure) => {
      /** Fails by default when we've called all given parsers. */
      if (parsers.length === 1) {
        return fail(failure);
      }

      return pipe(
        failure,
        /**
         * Recursively calls itself with the remaining parsers until a parser has succeeded.
         * We've checked the length above so there will always be a fn at index 1.
         */
        iterateUntilOk(...(parsers.slice(1) as Parsers)),
        concatCombinatorResult(failure)
      );
    })
  );
