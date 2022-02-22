import { merge } from 'rxjs';
import { Effect } from './store.types';

export const combineEffects =
  <State>(...effects: Effect<State>[]): Effect<State> =>
  (action$, state$) =>
    merge(...effects.map((effect) => effect(action$, state$)));
