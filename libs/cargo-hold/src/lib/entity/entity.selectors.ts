import type { ILens } from '@brandingbrand/standard-lens';
import type { EntityId, EntityState } from './entity.types';

export const makeSelectAll =
  <T, Structure>(lens: ILens<Structure, EntityState<T>>) =>
  (structure: Structure): T[] => {
    const state = lens.get(structure);

    // TODO @grayontheweb 04-01-2022 this pattern is repeated with minor
    // variations a few times in this file
    return state.ids.reduce<T[]>((acc, id) => {
      const entity = state.entities[id];
      return entity ? [...acc, entity] : acc;
    }, []);
  };

export const makeSelectByIds =
  <T, Structure>(lens: ILens<Structure, EntityState<T>>) =>
  (ids: EntityId[]) =>
  (structure: Structure): T[] => {
    const state = lens.get(structure);

    return ids.reduce<T[]>((acc, id) => {
      const entity = state.entities[id];
      return entity ? [...acc, entity] : acc;
    }, []);
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
    const id = state.ids[index];

    return id ? state.entities[id] : undefined;
  };

export const makeSelectByIndices =
  <T, Structure>(lens: ILens<Structure, EntityState<T>>) =>
  (indices: number[]) =>
  (structure: Structure): T[] => {
    const state = lens.get(structure);

    return indices.reduce<T[]>((acc, index) => {
      const id = state.ids[index];
      const entity = id ? state.entities[id] : undefined;

      return entity && entity in state.entities ? [...acc, entity] : acc;
    }, []);
  };

export const getSelectors = <T, Structure>(lens: ILens<Structure, EntityState<T>>) => ({
  selectAll: makeSelectAll(lens),
  selectByIds: makeSelectByIds(lens),
  selectById: makeSelectById(lens),
  selectByIndex: makeSelectByIndex(lens),
  selectByIndices: makeSelectByIndices(lens),
});
