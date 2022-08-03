import type { ILens } from '@brandingbrand/standard-lens';

import type { StateReducer } from '../../../store';
import type { EntityId, EntityState } from '../entity.types';

export interface EntityReducers<T, StateType> {
  addMany: (items: T[]) => StateReducer<StateType>;
  addOne: (item: T) => StateReducer<StateType>;
  setMany: (items: T[]) => StateReducer<StateType>;
  setOne: (item: T) => StateReducer<StateType>;
  setAll: (items: T[]) => StateReducer<StateType>;
  removeAll: () => StateReducer<StateType>;
  removeMany: (ids: EntityId[]) => StateReducer<StateType>;
  removeOne: (id: EntityId) => StateReducer<StateType>;
}

export interface EntitySelectors<T, StateType> {
  selectAll: (structure: StateType) => T[];
  selectByIds: (ids: EntityId[]) => (structure: StateType) => T[];
  selectByIndices: (indices: number[]) => (structure: StateType) => T[];
  selectById: (id: EntityId) => (structure: StateType) => T | undefined;
  selectByIndex: (index: number) => (structure: StateType) => T | undefined;
}

export interface EntityAdaptor<T, StateType> {
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
  lensedReducers: EntityReducers<T, StateType>;

  /**
   * Create an Adaptor that operates in a larger outer structure
   */
  withLens: <OuterStateType>(
    lens: ILens<OuterStateType, StateType>
  ) => EntityAdaptor<T, OuterStateType>;

  /**
   * An object of various helpful selectors
   */
  selectors: EntitySelectors<T, StateType>;
}
