import { pipe } from '@brandingbrand/standard-compose';
import type {
  AnyParser,
  Parser,
  ParserArgs,
  ParserOk,
  Parsers,
} from '@brandingbrand/standard-parser';
import { parseFail, parseOk } from '@brandingbrand/standard-parser';
import { flatMap, flatMapFailure, isFailure } from '@brandingbrand/standard-result';

import { many } from './combinator.many';
import type { ManyCombinator } from './combinator.types';

export const optional =
  <T>(parser: Parser<T>) =>
  ({ cursor = 0, input }: ParserArgs): ParserOk<T | undefined> =>
    pipe(parser({ cursor, input }), (result) => {
      if (isFailure(result)) {
        return parseOk<undefined>({
          cursor,
          cursorEnd: cursor,
          input,
          value: undefined,
        });
      }

      return result;
    });

export const any =
  <T, InputType>(...parsers: Parsers<T, InputType>): Parser<T> =>
  ({ cursor = 0, input }) =>
    pipe(
      parsers[0]({ cursor, input }),
      flatMapFailure((failure) => {
        if (parsers.length === 1) {
          return parseFail(failure);
        }

        const remainingParsers = parsers.slice(1) as typeof parsers;

        return pipe({ cursor, input }, any(...remainingParsers));
      })
    );

export const between =
  (start: AnyParser, end: AnyParser) =>
  <T>(parser: Parser<T>): Parser<T> =>
  ({ cursor = 0, input }) =>
    pipe(
      { cursor, input },
      many(start, parser, end),
      flatMap(({ cursorEnd, value }) =>
        parseOk({
          cursor,
          cursorEnd,
          input,
          value: value[1] as T,
        })
      )
    );

export const every: ManyCombinator =
  (...parsers) =>
  ({ cursor = 0, input }) =>
    pipe(
      { cursor, input },
      many(parsers[0]),
      flatMap((success) => {
        if (parsers.length === 1) {
          return parseOk(success);
        }

        const remainingParsers = parsers.slice(1) as typeof parsers;

        return pipe(
          { cursor, input },
          every(...remainingParsers),
          flatMap(({ cursorEnd, value }) =>
            parseOk({
              ...success,
              cursorEnd: cursorEnd >= success.cursorEnd ? cursorEnd : success.cursorEnd,
              value: [...success.value, ...value],
            })
          )
        );
      })
    );

export const surroundedBy =
  (delimiter: AnyParser) =>
  <T>(parser: Parser<T>) =>
    between(delimiter, delimiter)(parser);
