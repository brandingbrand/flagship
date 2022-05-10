import { Store, combineActionReducers, combineEffects } from '@brandingbrand/cargo-hold';

import type { GlobalStateConfig } from './types';

export const initializeCargoHold = <S>(config: GlobalStateConfig<S>) => {
  const store = new Store(config.initialState);
  store.registerReducer(combineActionReducers(...(config.reducers ?? [])));
  store.registerEffect(combineEffects(...(config.effects ?? [])));

  for (const handler of config.handlers ?? []) {
    store.registerHandler(handler);
  }

  return store;
};
