import { isFailure, isOk, isResult } from '@brandingbrand/standard-result';

import { isCombinatorBrand } from './combinator.brand';
import type { CombinatorFailure, CombinatorOk, CombinatorResult } from './combinator.types';

export const isCombinatorFailure = <T = unknown>(result: unknown): result is CombinatorFailure<T> =>
  isResult(result) && isFailure(result) && isCombinatorBrand(result.failure);

export const isCombinatorOk = <T = unknown>(result: unknown): result is CombinatorOk<T> =>
  isResult(result) && isOk(result) && isCombinatorBrand(result.ok);

export const isCombinatorResult = <T = unknown>(result: unknown): result is CombinatorResult<T> =>
  isCombinatorOk(result) || isCombinatorFailure(result);
