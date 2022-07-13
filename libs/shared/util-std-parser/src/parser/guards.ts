import type { Failure, Ok } from '@brandingbrand/standard-result';
import { isFailure, isOk } from '@brandingbrand/standard-result';

import type { ParserFailure, ParserOk, ParserResult } from './types';

export const isParserOk = (result: ParserResult | undefined): result is Ok<ParserOk> =>
  typeof result !== 'undefined' && isOk(result);

export const isParserFailure = (
  result: ParserResult | undefined
): result is Failure<ParserFailure> => typeof result !== 'undefined' && isFailure(result);
