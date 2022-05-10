import type { AnyActionHandler, AnyActionReducer, Effect } from '@brandingbrand/cargo-hold';

export interface GlobalStateConfig<StateType> {
  initialState: StateType;
  reducers?: Array<AnyActionReducer<StateType>>;
  effects?: Array<Effect<StateType>>;
  handlers?: AnyActionHandler[];
}
