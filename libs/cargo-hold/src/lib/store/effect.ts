import { merge } from 'rxjs';

import type { Effect } from './store.types';

/**
 * Combines multiple effects into one, merging all of their observables.
 *
 * @param effects The effects to combine.
 * @return The combined effect.
 */
export const combineEffects =
  <State>(...effects: Array<Effect<State>>): Effect<State> =>
  (action$, state$) =>
    merge(...effects.map((effect) => effect(action$, state$)));
