import type { ILens } from '@brandingbrand/standard-lens';

export type EntityId = number | string;

export interface EntityState<T> {
  ids: EntityId[];
  entities: Record<EntityId, T>;
}

export type EntityStateLens<T, StateType> = ILens<StateType, EntityState<T>>;

export type ComparerResult = -1 | 0 | 1;

export type Comparer<T> = (a: T, b: T) => ComparerResult;

export type IdSelector<T> = (entity: T) => EntityId;
