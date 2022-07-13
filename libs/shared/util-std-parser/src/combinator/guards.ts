import type { CombinatorFailure, CombinatorOk } from './types';

export const isCombinatorFailure = (
  result: CombinatorFailure | CombinatorOk
): result is CombinatorOk => typeof (result as CombinatorOk).cursorEnd !== 'number';

export const isCombinatorOk = (result: CombinatorFailure | CombinatorOk): result is CombinatorOk =>
  typeof (result as CombinatorOk).cursorEnd === 'number';
