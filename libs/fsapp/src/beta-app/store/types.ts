import type { AnyAction, ReducersMapObject } from 'redux';

export type GenericState = Readonly<Record<string, any>>;

export interface SSRData<S extends GenericState> {
  readonly initialState: S;
  readonly variables: Record<string, any>;
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
