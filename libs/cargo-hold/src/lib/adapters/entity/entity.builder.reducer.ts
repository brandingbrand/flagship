import { withLens } from '@brandingbrand/standard-lens';

import type { StateReducer } from '../../store';

import type { EntityBuilderDeps } from './entity.builder.types';
import type { EntityId, EntityState } from './entity.types';

const makeEntityState =
  <T, StateType>(builder: EntityBuilderDeps<T, StateType>, shouldOverwrite = false) =>
  (items: T[]): EntityState<T> => {
    const entities: EntityState<T>['entities'] = {};

    for (const item of items) {
      const id = builder.idSelector(item);

      /**
       * If `shouldOverwrite` is true, an item with a duplicate id
       * will replace any entity with the same id already in the
       * entities object. This prioritizes items from the end of the
       * items array backwards.
       */
      if (shouldOverwrite || typeof entities[id] !== 'undefined') {
        entities[id] = item;
      }
    }

    /**
     * If a comparer function has been given to the builder, sort the ids
     * using that comparer function whenever we make a new version of state.
     */
    const ids =
      typeof builder.comparer === 'undefined'
        ? Object.values(entities).map(builder.idSelector)
        : Object.values(entities).sort(builder.comparer).map(builder.idSelector);

    return { entities, ids };
  };

export const buildSetManyReducer =
  <T, StateType>(
    builder: EntityBuilderDeps<T, StateType>
  ): ((items: T[]) => StateReducer<StateType>) =>
  (items) =>
    withLens(builder.lens)((entityState) =>
      makeEntityState(builder, true)([...Object.values(entityState.entities), ...items])
    );

export const buildSetOneReducer =
  <T, StateType>(
    builder: EntityBuilderDeps<T, StateType>
  ): ((item: T) => StateReducer<StateType>) =>
  (item) =>
    buildSetManyReducer(builder)([item]);

export const buildSetAllReducer =
  <T, StateType>(
    builder: EntityBuilderDeps<T, StateType>
  ): ((items: T[]) => StateReducer<StateType>) =>
  (items) =>
    withLens(builder.lens)(() => makeEntityState(builder, true)(items));

export const buildAddManyReducer =
  <T, StateType>(
    builder: EntityBuilderDeps<T, StateType>
  ): ((items: T[]) => StateReducer<StateType>) =>
  (items) =>
    withLens(builder.lens)((entityState) =>
      makeEntityState(builder, false)([...Object.values(entityState.entities), ...items])
    );

export const buildAddOneReducer =
  <T, StateType>(
    builder: EntityBuilderDeps<T, StateType>
  ): ((item: T) => StateReducer<StateType>) =>
  (item) =>
    buildAddManyReducer(builder)([item]);

export const buildRemoveAllReducer =
  <T, StateType>(builder: EntityBuilderDeps<T, StateType>): (() => StateReducer<StateType>) =>
  () =>
    withLens(builder.lens)(() => makeEntityState(builder)([]));

export const buildRemoveManyReducer =
  <T, StateType>(
    builder: EntityBuilderDeps<T, StateType>
  ): ((ids: EntityId[]) => StateReducer<StateType>) =>
  (ids) =>
    withLens(builder.lens)((entityState) => {
      const entities = { ...entityState.entities };

      for (const id of ids) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete, fp/no-delete -- Efficient way to do this
        delete entities[id];
      }

      return makeEntityState(builder, true)(Object.values(entities));
    });

export const buildRemoveOneReducer =
  <T, StateType>(
    builder: EntityBuilderDeps<T, StateType>
  ): ((id: EntityId) => StateReducer<StateType>) =>
  (id) =>
    buildRemoveManyReducer(builder)([id]);
