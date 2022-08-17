import type { Branded } from '@brandingbrand/standard-branded';
import type {
  Parser,
  ParserArgs,
  ParserFailureFields,
  ParserOkFields,
  WithCursorEnd,
  WithValue,
} from '@brandingbrand/standard-parser';
import type { Failure, Ok, Result } from '@brandingbrand/standard-result';

import type { COMBINATOR_BRANDING } from './combinator.constants';

export type CombinatorParameter<T = unknown> = CombinatorParser<T> | Parser<T>;

export type CombinatorParameters<T = unknown> = [
  CombinatorParameter<T>,
  ...Array<CombinatorParameter<T>>
];

/** Parser types */
export type CombinatorParserResult<T = unknown> = Result<ParserOkFields<T>, ParserFailureFields>;

export type CombinatorParserResults<T = unknown> =
  | [...Array<Ok<ParserOkFields<T>>>, CombinatorParserResult<T>]
  | [Ok<ParserOkFields<T>>];

export type CombinatorParser<T = unknown, V = T> = (
  args: CombinatorOk<T, T[]>['ok'] | ParserArgs
) => CombinatorResult<T, V>;

/**
 * Utility types for composition
 */
export type WithParserResults<T = unknown> = Record<'results', CombinatorParserResults<T>>;

/**
 * Results
 */

export type CombinatorFailureFields<T = unknown> = ParserFailureFields & WithParserResults<T>;

export type CombinatorFailure<T = unknown> = Failure<
  Branded<CombinatorFailureFields<T>, typeof COMBINATOR_BRANDING>
>;

export type CombinatorOkFields<T = unknown, V = T> = Omit<ParserOkFields<T>, 'value'> &
  WithCursorEnd &
  WithParserResults<T> &
  WithValue<V>;

export type CombinatorOk<T = unknown, V = T> = Ok<
  Branded<CombinatorOkFields<T, V>, typeof COMBINATOR_BRANDING>
>;

export type CombinatorResult<T = unknown, V = T> = Result<
  CombinatorOk<T, V>['ok'],
  CombinatorFailure['failure']
>;

export type ManyCombinatorResult<T = unknown> = CombinatorResult<T, T[]>;

/**
 * Combinator
 */

export type Combinator<
  T = unknown,
  P extends CombinatorParameters<T> = CombinatorParameters<T>,
  V = T
> = (...parameters: P) => CombinatorParser<T, V>;

export type ManyCombinator<
  T = unknown,
  P extends CombinatorParameters<T> = CombinatorParameters<T>
> = Combinator<T, P, T[]>;
