export type GenericState = Record<string, any>;

export interface SSRData<S extends GenericState> {
  initialState: S;
  variables: any;
}

export interface StoreConfig<S extends GenericState> {
  initialState?: S;
  reducers?: any;
  uncachedData?: (initialState: SSRData<Partial<S>>, req?: Request) => Promise<SSRData<S>>;
  cachedData?: (initialState: SSRData<Partial<S>>, req?: Request) => Promise<SSRData<S>>;
}
