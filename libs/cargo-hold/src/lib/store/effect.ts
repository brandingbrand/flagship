import { merge } from 'rxjs';

import type { Effect } from './store.types';

export const combineEffects =
  <State>(...effects: Array<Effect<State>>): Effect<State> =>
  (action$, state$) =>
    merge(...effects.map((effect) => effect(action$, state$)));
