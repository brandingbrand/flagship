import { flow } from '@brandingbrand/standard-compose';
import type { Ok } from '@brandingbrand/standard-result';
import { flatMapFailure, mapOk, ok } from '@brandingbrand/standard-result';

import type { Parser, ParserOk } from '../parser';

import { iterate, iterateUntilOk } from './iterate';
import type { Combinator, CombinatorConstructor } from './types';
import { toCombinatorResult } from './util';

/**
 * A `Combinator` that returns a `CombinatorOk` as soon as one of
 * the provided `Parser` functions succeeds.
 *
 * @param parsers - Any non-empty array of `Parser` values
 * @return A `CombinatorResult`
 */
export const any: Combinator = (...parsers) => flow(iterateUntilOk(...parsers));

export const between: CombinatorConstructor<[Parser, Parser], [Parser]> =
  (start, end) => (parser) =>
    flow(
      iterate(...([start, parser, end] as [Parser, Parser, Parser])),
      mapOk((result) => {
        const parserResult = result.results[1] as Ok<ParserOk>;

        return { ...result, cursorEnd: parserResult.ok.cursorEnd };
      })
    );

export const either: Combinator<[Parser, Parser]> = (...parsers) => flow(iterate(...parsers));

export const every: Combinator = (...parsers) => flow(iterate(...parsers));

export const maybe: Combinator<[Parser]> = (parser) =>
  flow(
    parser,
    flatMapFailure((failure) => ok({ ...failure, cursorEnd: failure.cursor })),
    toCombinatorResult
  );

export const surroundedBy: CombinatorConstructor<[Parser]> = (delimiter) =>
  between(delimiter, delimiter);
