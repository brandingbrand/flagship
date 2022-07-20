import type { ILens } from '@brandingbrand/standard-lens';

import type { EntityId, EntitySelectors, EntityState } from './entity.types';

/**
 * Take all of the entities in an entity state from a given lens and returns
 * an array of the entities.
 *
 * @param lens
 * @return
 */
export const makeSelectAll =
  <T, StructureType>(lens: ILens<StructureType, EntityState<T>>) =>
  (structure: StructureType): T[] => {
    const state = lens.get(structure);

    // TODO @grayontheweb 04-01-2022 this pattern is repeated with minor
    // variations a few times in this file
    return state.ids.reduce<T[]>((acc, id) => {
      const entity = state.entities[id];
      return entity ? [...acc, entity] : acc;
    }, []);
  };

/**
 * Select the given Ids from the entity state from a give lens and returns an array of them.
 *
 * @param lens
 * @return
 */
export const makeSelectByIds =
  <T, StructureType>(lens: ILens<StructureType, EntityState<T>>) =>
  (ids: EntityId[]) =>
  (structure: StructureType): T[] => {
    const state = lens.get(structure);

    return ids.reduce<T[]>((acc, id) => {
      const entity = state.entities[id];
      return entity ? [...acc, entity] : acc;
    }, []);
  };

/**
 * Select the given Id from the entity state from a give lens and returns either the entity
 * or undefined.
 *
 * @param lens
 * @return
 */
export const makeSelectById =
  <T, StructureType>(lens: ILens<StructureType, EntityState<T>>) =>
  (id: EntityId) =>
  (structure: StructureType): T | undefined => {
    const state = lens.get(structure);
    return id in state.entities ? state.entities[id] : undefined;
  };

/**
 * Given an index it will select the Nth value if it exists.
 *
 * @param lens
 * @return
 */
export const makeSelectByIndex =
  <T, StructureType>(lens: ILens<StructureType, EntityState<T>>) =>
  (index: number) =>
  (structure: StructureType): T | undefined => {
    const state = lens.get(structure);
    const id = state.ids[index];

    return id !== undefined ? state.entities[id] : undefined;
  };

/**
 * Given multiple indices it will select the Nth values if they exist.
 *
 * @param lens
 * @return
 */
export const makeSelectByIndices =
  <T, StructureType>(lens: ILens<StructureType, EntityState<T>>) =>
  (indices: number[]) =>
  (structure: StructureType): T[] => {
    const state = lens.get(structure);

    return indices.reduce<T[]>((acc, index) => {
      const id = state.ids[index];
      const entity = id ? state.entities[id] : undefined;

      return entity !== undefined && entity in state.entities ? [...acc, entity] : acc;
    }, []);
  };
/**
 * Returns the full suite of selectors given the lens.
 *
 * @param lens
 * @return
 */
export const getSelectors = <T, StructureType>(
  lens: ILens<StructureType, EntityState<T>>
): EntitySelectors<T, StructureType> => ({
  selectAll: makeSelectAll(lens),
  selectByIds: makeSelectByIds(lens),
  selectById: makeSelectById(lens),
  selectByIndex: makeSelectByIndex(lens),
  selectByIndices: makeSelectByIndices(lens),
});
