import type {
  EntityBuilderDeps,
  SelectAllEntities,
  SelectEntitiesById,
  SelectEntityById,
  SelectEntityByIndex,
  SelectEntityByIndices,
} from './entity.builder.types';
import type { EntityState } from './entity.types';

export const buildSelectAll =
  <T, StateType = EntityState<T>>(
    builder: EntityBuilderDeps<T, StateType>
  ): SelectAllEntities<T, StateType> =>
  (state) => {
    const entityState = builder.lens.get(state);
    const entities = [];

    for (let i = 0; i < entityState.ids.length; i += 1) {
      const id = entityState.ids[i] ?? '';
      const entity = entityState.entities[id];

      if (typeof entity !== 'undefined') {
        entities.push(entity);
      }
    }

    return entities;
  };

export const buildSelectByIds =
  <T, StateType = EntityState<T>>(
    builder: EntityBuilderDeps<T, StateType>
  ): SelectEntitiesById<T, StateType> =>
  (ids) =>
  (state) => {
    const entityState = builder.lens.get(state);
    const entities = [];

    for (const id of ids) {
      const entity = entityState.entities[id];

      if (typeof entity !== 'undefined') {
        entities.push(entity);
      }
    }

    return entities;
  };

export const buildSelectById =
  <T, StateType = EntityState<T>>(
    builder: EntityBuilderDeps<T, StateType>
  ): SelectEntityById<T, StateType> =>
  (id) =>
  (state) =>
    builder.lens.get(state).entities[id];

export const buildSelectByIndex =
  <T, StateType = EntityState<T>>(
    builder: EntityBuilderDeps<T, StateType>
  ): SelectEntityByIndex<T, StateType> =>
  (index) =>
  (state) => {
    const { entities, ids } = builder.lens.get(state);
    const id = ids[index];

    return entities[id ?? ''];
  };

export const buildSelectByIndices =
  <T, StateType = EntityState<T>>(
    builder: EntityBuilderDeps<T, StateType>
  ): SelectEntityByIndices<T, StateType> =>
  (indices) =>
  (state) => {
    const entityState = builder.lens.get(state);
    const entities = [];

    for (const index of indices) {
      const id = entityState.ids[index];
      const entity = entityState.entities[id ?? ''];

      if (typeof entity !== 'undefined') {
        entities.push(entity);
      }
    }

    return entities;
  };
