import { pipe } from '@brandingbrand/standard-compose';
import type { AnyParser, ParserOk } from '@brandingbrand/standard-parser';
import { parseFail, parseOk } from '@brandingbrand/standard-parser';
import { flatMap, flatMapFailure } from '@brandingbrand/standard-result';

import { many } from './combinator.many';
import { combinateFail, combinateOk } from './combinator.result';
import type {
  Combinator,
  CombinatorParameter,
  CombinatorParser,
  CombinatorParserResults,
  ManyCombinator,
} from './combinator.types';
import { toCombinatorResult } from './combinator.util';

export const any: Combinator =
  (...parsers) =>
  ({ cursor = 0, input }) =>
    pipe(
      parsers[0]({ cursor, input }),
      toCombinatorResult,
      flatMap((success) => combinateOk({ ...success, results: [parseOk(success)] })),
      flatMapFailure((failure) => {
        if (parsers.length === 1) {
          return combinateFail({ ...failure, results: [parseFail(failure)] });
        }

        const remainingParsers = parsers.slice(1) as typeof parsers;

        return pipe({ cursor, input }, any(...remainingParsers));
      })
    );

export const between =
  (
    start: CombinatorParameter,
    end: CombinatorParameter
  ): Combinator<unknown, [CombinatorParameter]> =>
  (parser) =>
  ({ cursor = 0, input }) =>
    pipe(
      { cursor, input },
      many(start, parser, end),
      flatMap(({ cursorEnd, results }) => {
        const { value } = (results[1] as ParserOk<unknown>).ok;

        return combinateOk({
          cursor,
          cursorEnd,
          input,
          results,
          value,
        });
      })
    );

export const every: ManyCombinator =
  (...parsers) =>
  ({ cursor = 0, input }) =>
    pipe(
      { cursor, input },
      many(parsers[0]),
      flatMap((success) => {
        if (parsers.length === 1) {
          return combinateOk(success);
        }

        const remainingParsers = parsers.slice(1) as typeof parsers;

        return pipe(
          { cursor, input },
          every(...remainingParsers),
          flatMapFailure((failure) =>
            combinateFail({
              ...failure,
              results: [...success.results, ...failure.results] as CombinatorParserResults,
            })
          ),
          flatMap(({ cursorEnd, results, value }) =>
            combinateOk({
              ...success,
              cursorEnd: cursorEnd >= success.cursorEnd ? cursorEnd : success.cursorEnd,
              results: [...success.results, ...results] as CombinatorParserResults,
              value: [...success.value, ...value],
            })
          )
        );
      })
    );

export const surroundedBy =
  (delimiter: CombinatorParameter): Combinator<unknown, [CombinatorParser]> =>
  (parser) =>
    between(delimiter, delimiter)(parser);
