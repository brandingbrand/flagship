import type { ILens } from '@brandingbrand/standard-lens';
import type { EntityId, EntityState } from './entity.types';

export const makeSelectAll =
  <T, Structure>(lens: ILens<Structure, EntityState<T>>) =>
  (structure: Structure): T[] => {
    const state = lens.get(structure);
    return state.ids.map((id) => state.entities[id]);
  };

export const makeSelectByIds =
  <T, Structure>(lens: ILens<Structure, EntityState<T>>) =>
  (ids: EntityId[]) =>
  (structure: Structure): T[] => {
    const state = lens.get(structure);
    return ids.filter((id) => id in state.entities).map((id) => state.entities[id]);
  };

export const makeSelectById =
  <T, Structure>(lens: ILens<Structure, EntityState<T>>) =>
  (id: EntityId) =>
  (structure: Structure): T | undefined => {
    const state = lens.get(structure);
    return id in state.entities ? state.entities[id] : undefined;
  };

export const makeSelectByIndex =
  <T, Structure>(lens: ILens<Structure, EntityState<T>>) =>
  (index: number) =>
  (structure: Structure): T | undefined => {
    const state = lens.get(structure);
    return index < state.ids.length ? state.entities[state.ids[index]] : undefined;
  };

export const makeSelectByIndices =
  <T, Structure>(lens: ILens<Structure, EntityState<T>>) =>
  (indices: number[]) =>
  (structure: Structure): T[] => {
    const state = lens.get(structure);
    const length = state.ids.length;
    return indices
      .filter((index) => index < length && state.ids[index] in state.entities)
      .map((id) => state.entities[state.ids[id]]);
  };

export const getSelectors = <T, Structure>(lens: ILens<Structure, EntityState<T>>) => ({
  selectAll: makeSelectAll(lens),
  selectByIds: makeSelectByIds(lens),
  selectById: makeSelectById(lens),
  selectByIndex: makeSelectByIndex(lens),
  selectByIndices: makeSelectByIndices(lens),
});
