import type { Lens } from '../lens';
import type { StateReducer } from '../store';

export type EntityId = string | number;
export type IdSelector<T> = (entity: T) => EntityId;
export type ComparerResult = 1 | 0 | -1;
export type Comparer<T> = (a: T, b: T) => ComparerResult;
export type EntityState<T> = {
  ids: EntityId[];
  entities: Record<EntityId, T>;
};
export interface EntityReducers<T, Structure> {
  addMany: (items: T[]) => StateReducer<Structure>;
  addOne: (item: T) => StateReducer<Structure>;
  setMany: (items: T[]) => StateReducer<Structure>;
  setOne: (item: T) => StateReducer<Structure>;
  setAll: (items: T[]) => StateReducer<Structure>;
  removeAll: () => StateReducer<Structure>;
  removeMany: (ids: EntityId[]) => StateReducer<Structure>;
  removeOne: (id: EntityId) => StateReducer<Structure>;
}

export interface EntitySelectors<T, Structure> {
  selectAll: (structure: Structure) => T[];
  selectByIds: (ids: EntityId[]) => (structure: Structure) => T[];
  selectByIndices: (indices: number[]) => (structure: Structure) => T[];
  selectById: (id: EntityId) => (structure: Structure) => T | undefined;
  selectByIndex: (index: number) => (structure: Structure) => T | undefined;
}

export interface EntityAdaptor<T, Structure = EntityState<T>> {
  /**
   * Create an EntityState based on the array of entities provided
   */
  createState: (initialEntities: T[]) => EntityState<T>;

  /**
   * A default, empty EntityState that contains no items
   */
  empty: EntityState<T>;

  /**
   * An object of functions that return StateReducers operating on EntityStates
   */
  reducers: EntityReducers<T, EntityState<T>>;

  /**
   * An object of functions that return StateReducers operating on the entire store, focused
   * on the Adaptor's focussed EntityStates
   */
  lensedReducers: EntityReducers<T, Structure>;

  /**
   * Create an Adaptor that operates in a larger outer structure
   */
  withLens: <OuterStructure>(
    lens: Lens<OuterStructure, Structure>
  ) => EntityAdaptor<T, OuterStructure>;

  /**
   * An object of various helpful selectors
   */
  selectors: EntitySelectors<T, Structure>;
}
