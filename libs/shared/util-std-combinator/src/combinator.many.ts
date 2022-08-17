import type { ParserOkFields, ParserResult } from '@brandingbrand/standard-parser';
import type { Ok } from '@brandingbrand/standard-result';
import { isFailure } from '@brandingbrand/standard-result';
import { isOk } from '@brandingbrand/standard-result';

import { combinateFail, combinateOk } from './combinator.result';
import type {
  CombinatorParameters,
  CombinatorParser,
  CombinatorParserResult,
  CombinatorParserResults,
  CombinatorResult,
} from './combinator.types';

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
  <T = unknown>(...parsers: CombinatorParameters<T>): CombinatorParser<T, T[]> =>
  (args) =>
    parsers.reduce(
      (aggregate, parser) => {
        if (isFailure(aggregate)) {
          return aggregate;
        }

        const parserResult: CombinatorParserResult<T> | ParserResult<T> = parser({
          ...aggregate.ok,
          cursor: aggregate.ok.cursorEnd,
        });

        if (isOk(parserResult)) {
          return combinateOk({
            cursor: args.cursor,
            cursorEnd: parserResult.ok.cursorEnd,
            input: aggregate.ok.input,
            value: [...aggregate.ok.value, parserResult.ok.value],
            results: [...(aggregate.ok.results as Array<Ok<ParserOkFields<T>>>), parserResult],
          });
        }

        return combinateFail({
          input: args.input,
          cursor: args.cursor,
          fatal: parserResult.failure.fatal,
          results: [...(aggregate.ok.results as Array<Ok<ParserOkFields<T>>>), parserResult],
        });
      },
      combinateOk({
        results: [] as unknown as CombinatorParserResults<T>,
        value: [],
        cursorEnd: args.cursor ?? 0,
        ...args,
      }) as CombinatorResult<T, T[]>
    );
