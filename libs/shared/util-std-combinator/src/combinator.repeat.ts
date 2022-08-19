import { pipe } from '@brandingbrand/standard-compose';
import type {
  Parser,
  ParserArgs,
  ParserFailure,
  ParserOk,
  ParserOkFields,
  ParserResult,
} from '@brandingbrand/standard-parser';
import { parseOk } from '@brandingbrand/standard-parser';
import { flatMap, flatMapFailure } from '@brandingbrand/standard-result';

import { many } from './combinator.many';
import type { Combinator } from './combinator.types';

/**
 * Given a `Parser`, repeatedly runs that parser until it fails.
 *
 * @param parser - Any `Parser`
 * @return A `Combinator` that succeeds as long as the parser succeeds
 *         a single time.
 */
export const repeat =
  <T>(parser: Parser<T>): Parser<[T, ...T[]]> =>
  (args) => {
    const internalRepeat =
      (internalParser: Parser<T, T>): Parser<[T, ...T[]]> =>
      (internalArgs) =>
        pipe(
          internalArgs,
          many(internalParser),
          flatMap((success) =>
            pipe(
              { ...internalArgs, cursor: success.cursorEnd },
              internalRepeat(internalParser),
              flatMap<
                ParserOk<[T, ...T[]]>['ok'],
                ParserOk<[T, ...T[]]>['ok'],
                ParserFailure['failure']
              >(({ cursorEnd, value }) =>
                parseOk({
                  ...success,
                  cursorEnd,
                  value: [...(success.value as [T, ...T[]]), ...value],
                })
              ),
              flatMapFailure(() =>
                parseOk<[T, ...T[]]>(success as unknown as ParserOkFields<[T, ...T[]]>)
              )
            )
          )
        );

    return internalRepeat(parser)(args);
  };

/**
 * Given a `Parser` (`terminator`), returns a `Combinator` that repeatedly runs a
 * `Parser` until it either fails or the `terminator` succeeds. Note: The `Parser`
 * passed to the constructed function must succeed at least once before the
 * `terminator` will be attempted.
 *
 * @param terminator - Any `Parser`.
 * @return A `Combinator`.
 */
export const repeatUntilTerminator =
  <T>(terminator: Parser<T>): Combinator<T, [Parser<T, T>], T[]> =>
  (parser) =>
  (args: ParserArgs | ParserOkFields<T[]>) =>
    pipe(
      args,
      many(parser),
      flatMap((success) =>
        pipe(
          terminator({ cursor: success.cursorEnd, input: args.input }),
          flatMap(() => parseOk({ ...success, cursor: args.cursor })),
          flatMapFailure(() =>
            pipe(
              { ...success, cursor: args.cursor },
              repeatUntilTerminator<T>(terminator)(parser),
              flatMapFailure(() => parseOk({ ...success, cursor: args.cursor }))
            )
          )
        )
      )
    );
