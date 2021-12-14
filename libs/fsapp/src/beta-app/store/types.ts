import type { Dictionary } from '@brandingbrand/fsfoundation';
import type { AnyAction, ReducersMapObject } from 'redux';

export type GenericState = Readonly<Dictionary>;

export interface SSRData<S extends GenericState> {
  readonly initialState: S;
  readonly variables: Dictionary;
}

export interface StoreConfig<
  S extends GenericState = GenericState,
  A extends AnyAction = AnyAction
> {
  readonly initialState?: S;
  readonly reducers: ReducersMapObject<S, A>;
  readonly uncachedData?: (initialState: SSRData<Partial<S>>, req?: Request) => Promise<SSRData<S>>;
  readonly cachedData?: (initialState: SSRData<Partial<S>>, req?: Request) => Promise<SSRData<S>>;
}
