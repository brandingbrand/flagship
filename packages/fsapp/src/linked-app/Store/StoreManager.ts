import configureStore from '../../store/configureStore';
import { GenericState, StoreConfig } from './types';

export class StoreManager<S extends GenericState> {
  constructor(private readonly config: StoreConfig<S>) {}

  public updatedInitialState = async (excludeUncached?: boolean, req?: Request) => {
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

    return updatedState;
  }

  public getReduxStore = async <S>(initialState?: S) => {
    return configureStore(initialState ?? this.config.initialState, this.config.reducers);
  }
}
