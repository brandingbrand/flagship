import { withLens } from '@brandingbrand/standard-lens';

import type { StateReducer } from '../../../store/store.types';
import type { EntityId, EntityState } from '../entity.types';

import type { EntityReducers } from './entity.types';
import type { EntityAdaptorDeps } from './entity.types.internal';

// dedupe ids while preserving order
const mergeIdLists = (...ids: EntityId[]): EntityId[] =>
  ids.reduce<EntityId[]>((result, id) => {
    if (!result.includes(id)) {
      result.push(id);
    }
    return result;
  }, []);

export const sortIfNeeded =
  <T, StructureType = EntityState<T>>(deps: EntityAdaptorDeps<T, StructureType>) =>
  (items: Record<number | string, T>, idList?: EntityId[]): EntityId[] => {
    if (!deps.isSorted) {
      return idList ?? Object.values(items).map(deps.idSelector);
    }
    const entitiesValues = Object.values(items);
    entitiesValues.sort(deps.comparer);
    return entitiesValues.map(deps.idSelector);
  };

export const fromEntityArray =
  <T, StructureType = EntityState<T>>(deps: EntityAdaptorDeps<T, StructureType>) =>
  (items: T[]): Record<number | string, T> =>
    Object.fromEntries(items.map((val) => [deps.idSelector(val), val]));

export const makeCreateState =
  <T, StructureType = EntityState<T>>(deps: EntityAdaptorDeps<T, StructureType>) =>
  (initialEntities: T[]): EntityState<T> => ({
    ids: initialEntities.map(deps.idSelector),
    entities: Object.fromEntries(initialEntities.map((val) => [deps.idSelector(val), val])),
  });

/**
 * Take an array of items and make a reducer that adds those items to an existing state,
 * overriding existing ids that collide.
 *
 * @param deps
 * @return
 */
export const makeSetMany =
  <T, StructureType = EntityState<T>>(deps: EntityAdaptorDeps<T, StructureType>) =>
  (items: T[]): StateReducer<StructureType> =>
    withLens(deps.lens)((state: EntityState<T>): EntityState<T> => {
      const entities = { ...state.entities, ...fromEntityArray(deps)(items) };
      const ids = mergeIdLists(...state.ids, ...items.map(deps.idSelector));
      return {
        ids: sortIfNeeded(deps)(entities, ids),
        entities,
      };
    });

/**
 * Takes an item and makes a reducer that adds that item to an existing state, overriding
 * the existing id if it exists.
 *
 * @param deps
 * @return
 */
export const makeSetOne =
  <T, StructureType = EntityState<T>>(deps: EntityAdaptorDeps<T, StructureType>) =>
  (item: T): StateReducer<StructureType> =>
    makeSetMany(deps)([item]);

/**
 * Take an array of items and make a reducer that adds those items to an existing state,
 * preserving existing ids.
 *
 * @param deps
 * @return
 */
export const makeAddMany =
  <T, StructureType = EntityState<T>>(deps: EntityAdaptorDeps<T, StructureType>) =>
  (items: T[]): StateReducer<StructureType> =>
  (structure: StructureType): StructureType => {
    const state = deps.lens.get(structure);
    const newIds = items.map(deps.idSelector).filter((val) => !state.ids.includes(val));
    if (newIds.length === 0) {
      return structure;
    }
    const newItems = items.filter((val) => newIds.includes(deps.idSelector(val)));
    return makeSetMany(deps)(newItems)(structure);
  };

/**
 * Takes an item and makes a reducer that adds that item to an existing state, preserving
 * the existing id if it exists.
 *
 * @param deps
 * @return
 */
export const makeAddOne =
  <T, StructureType = EntityState<T>>(deps: EntityAdaptorDeps<T, StructureType>) =>
  (item: T): StateReducer<StructureType> =>
    makeAddMany(deps)([item]);

/**
 * Takes an array of items and replaces the existing state with the incoming state.
 *
 * @param deps
 * @return
 */
export const makeSetAll =
  <T, StructureType = EntityState<T>>(deps: EntityAdaptorDeps<T, StructureType>) =>
  (items: T[]): StateReducer<StructureType> =>
  (structure: StructureType) =>
    makeSetMany(deps)(items)(deps.lens.set(makeCreateState(deps)([]))(structure));

/**
 * Removes all entities and state ids.
 *
 * @param deps
 * @return
 */
export const makeRemoveAll =
  <T, StructureType = EntityState<T>>(deps: EntityAdaptorDeps<T, StructureType>) =>
  (): StateReducer<StructureType> =>
  (structure) =>
    deps.lens.set(makeCreateState(deps)([]))(structure);

/**
 * Takes an array of entity ids and returns a reducer that removes those ids if they exist.
 *
 * @param deps
 * @return
 */
export const makeRemoveMany =
  <T, StructureType = EntityState<T>>(deps: EntityAdaptorDeps<T, StructureType>) =>
  (ids: EntityId[]): StateReducer<StructureType> =>
    withLens(deps.lens)((state) => {
      const newIds = state.ids.filter((id) => !ids.includes(id));
      const newEntities = Object.fromEntries(newIds.map((id) => [id, state.entities[id]]));

      // TODO @grayontheweb 04-01-2022 we shouldn't have to type coerce this but
      // this is a quick fix
      return {
        ids: newIds,
        entities: newEntities,
      } as EntityState<T>;
    });

/**
 * Takes an entity id, returns a reducer that removes it if it exists.
 *
 * @param deps
 * @return
 */
export const makeRemoveOne =
  <T, StructureType = EntityState<T>>(deps: EntityAdaptorDeps<T, StructureType>) =>
  (id: EntityId): StateReducer<StructureType> =>
    makeRemoveMany(deps)([id]);

/**
 * Returns a full suite of reducers applying the given dependencies.
 *
 * @param deps
 * @return
 */
export const makeReducers = <T, Structure = EntityState<T>>(
  deps: EntityAdaptorDeps<T, Structure>
): EntityReducers<T, Structure> => ({
  addMany: makeAddMany(deps),
  addOne: makeAddOne(deps),
  setMany: makeSetMany(deps),
  setOne: makeSetOne(deps),
  setAll: makeSetAll(deps),
  removeAll: makeRemoveAll(deps),
  removeMany: makeRemoveMany(deps),
  removeOne: makeRemoveOne(deps),
});
