import { pipe } from '@brandingbrand/standard-compose';
import type { Parser, ParserArgs, ParserOk } from '@brandingbrand/standard-parser';
import { EMPTY_VALUE, parseFail, parseOk } from '@brandingbrand/standard-parser';
import { flatMap, flatMapFailure } from '@brandingbrand/standard-result';

import { many } from './combinator.many';
import { combinateFail, combinateOk } from './combinator.result';
import type { CombinatorResult } from './combinator.types';
import { toCombinator } from './combinator.util';

export const any =
  <T>(...parsers: [Parser<T>, ...Array<Parser<T>>]) =>
  ({ cursor = 0, input }: ParserArgs): CombinatorResult<T, T> =>
    pipe(
      { cursor, input },
      parsers[0],
      flatMap((success) => combinateOk({ ...success, results: [parseOk(success)] })),
      flatMapFailure((failure) => {
        if (parsers.length === 1) {
          return combinateFail({ ...failure, results: [parseFail(failure)] });
        }

        const remainingParsers = parsers.slice(1) as [Parser<T>, ...Array<Parser<T>>];

        return pipe({ cursor, input }, any<T>(...remainingParsers));
      })
    );

export const between =
  <T>(start: Parser<T>, end: Parser<T>) =>
  (parser: Parser<T>) =>
  ({ cursor = 0, input }: ParserArgs): CombinatorResult<T, T> =>
    pipe(
      { cursor, input },
      many<T, [Parser<T>, Parser<T>, Parser<T>]>(start, parser, end),
      flatMap((success) => {
        const { value } = (success.results[1] as ParserOk<T>).ok;

        return combinateOk({ ...success, value });
      })
    );

export const either =
  <T>(...parsers: [Parser<T>, Parser<T>]) =>
  ({ cursor = 0, input }: ParserArgs) =>
    pipe({ cursor, input }, any(...parsers));

export const maybe =
  <T>(parser: Parser<T>) =>
  ({ cursor = 0, input }: ParserArgs) =>
    pipe(
      { cursor, input },
      toCombinator(parser),
      flatMap((success) => combinateOk<T>(success)),
      flatMapFailure((failure) =>
        combinateOk<T>({
          ...failure,
          cursorEnd: cursor,
          results: [parseFail(failure)],
          value: EMPTY_VALUE,
        })
      )
    );

export const surroundedBy =
  <T>(delimiter: Parser<T>) =>
  (parser: Parser<T>) =>
    between(delimiter, delimiter)(parser);
