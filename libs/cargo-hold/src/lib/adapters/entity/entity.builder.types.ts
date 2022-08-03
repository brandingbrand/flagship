import type { Comparer, EntityId, EntityState, EntityStateLens, IdSelector } from './entity.types';

const ENTITY_TYPE_SYMBOL = Symbol('EntityType');
const STATE_TYPE_SYMBOL = Symbol('StateType');

/* eslint-disable @typescript-eslint/consistent-type-definitions -- These may need to be types */
export type EntityBuilder<T = unknown, StateType = EntityState<T>> = {
  [ENTITY_TYPE_SYMBOL]?: T;
  [STATE_TYPE_SYMBOL]?: StateType;
};

/* eslint-enable @typescript-eslint/consistent-type-definitions */

export type WithEntityStateLens<T, StateType = EntityState<T>> = Record<
  'lens',
  EntityStateLens<T, StateType>
>;

export type WithComparer<T> = Record<'comparer', Comparer<T>>;

export type WithIdSelector<T> = Record<'idSelector', IdSelector<T>>;

export type EntityBuilderLensDep<T, StateType = EntityState<T>> = WithEntityStateLens<T, StateType>;

export type EntityBuilderDeps<T, StateType = EntityState<T>> = EntityBuilder<T, StateType> &
  EntityBuilderLensDep<T, StateType> &
  WithComparer<T> &
  WithIdSelector<T>;

/** Selectors */
export type SelectAllEntities<T, StateType = EntityState<T>> = (state: StateType) => T[];

export type SelectEntitiesById<T, StateType = EntityState<T>> = (
  ids: EntityId[]
) => (state: StateType) => T[];

export type SelectEntityById<T, StateType = EntityState<T>> = (
  id: EntityId
) => (state: StateType) => T | undefined;

export type SelectEntityByIndex<T, StateType> = (
  index: number
) => (state: StateType) => T | undefined;

export type SelectEntityByIndices<T, StateType = EntityState<T>> = (
  indices: number[]
) => (state: StateType) => T[];
