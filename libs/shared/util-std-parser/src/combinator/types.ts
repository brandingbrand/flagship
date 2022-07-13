import type { Failure, Ok, Result } from '@brandingbrand/standard-result';

import type {
  ParserArgs,
  ParserFailure,
  ParserOk,
  ParserResult,
  ParserResultSuccess,
  Parsers,
} from '../parser';

import type { RESULTS } from './constants';

export type CombinatorParserResults = [...ParserResultSuccess[], ParserResult] | [ParserResult];

export type WithCombinatorParserResults = Record<typeof RESULTS, CombinatorParserResults>;

export type CombinatorOk = ParserOk & WithCombinatorParserResults;

export type CombinatorFailure = ParserFailure & WithCombinatorParserResults;

export type CombinatorResult = Result<CombinatorOk, CombinatorFailure>;

export type CombinatorResultOk = Ok<CombinatorOk>;

export type CombinatorResultFailure = Failure<CombinatorFailure>;

export type Combinator<P extends Parsers = Parsers> = (
  ...parsers: P
) => (args: ParserArgs) => CombinatorResult;

export type CombinatorConstructor<
  ParamsType extends unknown[] = Parsers,
  P extends Parsers = Parsers
> = (...params: ParamsType) => Combinator<P>;
