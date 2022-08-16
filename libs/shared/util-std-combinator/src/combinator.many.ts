import { pipe } from '@brandingbrand/standard-compose';
import type { Parser, ParserArgs } from '@brandingbrand/standard-parser';
import { parseFail, parseOk } from '@brandingbrand/standard-parser';
import { flatMap, flatMapFailure } from '@brandingbrand/standard-result';

import { combinateFail, combinateOk } from './combinator.result';
import type { CombinatorParserResults, CombinatorResult } from './combinator.types';

/**
 * Given any number of parsers as params, iterates through them
 * sequentially until either all parsers have run successfully or
 * any parser fails. The `cursorEnd` value of the previous parser
 * is used as the `cursor` value for the subsequent parser.
 *
 * @param parsers - Any parser functions
 * @return A CombinatorResult
 */
export const many =
  <T, ParsersT extends [Parser<T>, ...Array<Parser<T>>]>(...parsers: ParsersT) =>
  (args: ParserArgs): CombinatorResult<T, T[]> =>
    pipe(
      args,
      parsers[0],
      flatMapFailure((failure) => combinateFail<T>({ ...args, results: [parseFail(failure)] })),
      flatMap((success) =>
        combinateOk<T, T[]>({
          ...args,
          cursorEnd: success.cursorEnd,
          results: [parseOk(success)],
          value: [success.value],
        })
      ),
      flatMap((success) => {
        /** Succeeds by default when we've called all given parsers. */
        if (parsers.length === 1) {
          return combinateOk(success);
        }

        const remainingParsers = parsers.slice(1) as [Parser<T>, ...Array<Parser<T>>];

        return pipe(
          { ...args, cursor: success.cursorEnd },
          /**
           * Recursively calls itself with the remaining parsers until a parser has failed.
           * We've checked the length above so there will always be a fn at index 1.
           */
          many<T, typeof remainingParsers>(...remainingParsers),
          flatMapFailure(({ results }) =>
            combinateFail({
              ...success,
              results: [...success.results, ...results] as CombinatorParserResults<T>,
            })
          ),
          flatMap(({ cursorEnd, results, value }) =>
            combinateOk<T, T[]>({
              ...success,
              cursorEnd,
              results: [...success.results, ...results] as CombinatorParserResults<T>,
              value: [...success.value, ...value],
            })
          )
        );
      })
    );
