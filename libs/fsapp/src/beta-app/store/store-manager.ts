import type { Action, PreloadedState } from 'redux';
import type { GenericState, StoreConfig } from './types';

import { configureStore } from './configure-store';

export class StoreManager<S extends GenericState, A extends Action> {
  constructor(private readonly config: StoreConfig<S, A>) {}

  public updatedInitialState = async (excludeUncached?: boolean, req?: Request): Promise<S> => {
    let updatedState = this.config.initialState ?? {};
    if (this.config.cachedData) {
      updatedState = (
        await this.config.cachedData(
          {
            initialState: updatedState,
            variables: {}
          },
          req
        )
      ).initialState;
    }

    if (this.config.uncachedData && excludeUncached !== false) {
      updatedState = (
        await this.config.uncachedData(
          {
            initialState: updatedState,
            variables: {}
          },
          req
        )
      ).initialState;
    }

    return updatedState as S;
  }

  public getReduxStore = async (initialState?: S) => {
    return configureStore(
      (initialState ?? this.config.initialState) as unknown as PreloadedState<S>,
      this.config.reducers
    );
  }
}
