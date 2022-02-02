import { EntityReducers } from '.';
import { withLens } from '../lens';
import type { StateReducer } from '../store/store.types';
import type { EntityId, EntityState } from './entity.types';
import type { EntityAdaptorDeps } from './entity.types.internal';

// dedupe ids while preserving order
const mergeIdLists = (...ids: EntityId[]): EntityId[] =>
  ids.reduce((result, id) => {
    if (!result.includes(id)) {
      result.push(id);
    }
    return result;
  }, [] as EntityId[]);

export const sortIfNeeded =
  <T, Structure = EntityState<T>>(deps: EntityAdaptorDeps<T, Structure>) =>
  (items: Record<string | number, T>, idList?: EntityId[]): EntityId[] => {
    if (!deps.isSorted) {
      return idList ?? Object.values(items).map(deps.idSelector);
    }
    const entitiesValues = Object.values(items);
    entitiesValues.sort(deps.comparer);
    return entitiesValues.map(deps.idSelector);
  };

export const fromEntityArray =
  <T, Structure = EntityState<T>>(deps: EntityAdaptorDeps<T, Structure>) =>
  (items: T[]): Record<string | number, T> => {
    return Object.fromEntries(items.map((val) => [deps.idSelector(val), val]));
  };

export const makeCreateState =
  <T, Structure = EntityState<T>>(deps: EntityAdaptorDeps<T, Structure>) =>
  (initialEntities: T[]): EntityState<T> => ({
    ids: initialEntities.map(deps.idSelector),
    entities: Object.fromEntries(initialEntities.map((val) => [deps.idSelector(val), val])),
  });

export const makeSetMany =
  <T, Structure = EntityState<T>>(deps: EntityAdaptorDeps<T, Structure>) =>
  (items: T[]): StateReducer<Structure> =>
    withLens(deps.lens)((state: EntityState<T>): EntityState<T> => {
      const entities = { ...state.entities, ...fromEntityArray(deps)(items) };
      const ids = mergeIdLists(...state.ids, ...items.map(deps.idSelector));
      return {
        ids: sortIfNeeded(deps)(entities, ids),
        entities,
      };
    });

export const makeSetOne =
  <T, Structure = EntityState<T>>(deps: EntityAdaptorDeps<T, Structure>) =>
  (item: T): StateReducer<Structure> =>
    makeSetMany(deps)([item]);

export const makeAddMany =
  <T, Structure = EntityState<T>>(deps: EntityAdaptorDeps<T, Structure>) =>
  (items: T[]): StateReducer<Structure> =>
  (structure: Structure): Structure => {
    const state = deps.lens.get(structure);
    const newIds = items.map(deps.idSelector).filter((val) => !state.ids.includes(val));
    if (!newIds.length) {
      return structure;
    }
    const newItems = items.filter((val) => newIds.includes(deps.idSelector(val)));
    return makeSetMany(deps)(newItems)(structure);
  };

export const makeAddOne =
  <T, Structure = EntityState<T>>(deps: EntityAdaptorDeps<T, Structure>) =>
  (item: T): StateReducer<Structure> =>
    makeAddMany(deps)([item]);

export const makeSetAll =
  <T, Structure = EntityState<T>>(deps: EntityAdaptorDeps<T, Structure>) =>
  (items: T[]): StateReducer<Structure> =>
  (structure: Structure) =>
    makeSetMany(deps)(items)(deps.lens.set(makeCreateState(deps)([]))(structure));

export const makeRemoveAll =
  <T, Structure = EntityState<T>>(deps: EntityAdaptorDeps<T, Structure>) =>
  (): StateReducer<Structure> =>
  (structure) =>
    deps.lens.set(makeCreateState(deps)([]))(structure);

export const makeRemoveMany =
  <T, Structure = EntityState<T>>(deps: EntityAdaptorDeps<T, Structure>) =>
  (ids: EntityId[]): StateReducer<Structure> =>
    withLens(deps.lens)((state) => {
      const newIds = state.ids.filter((id) => !ids.includes(id));
      const newEntities = Object.fromEntries(newIds.map((id) => [id, state.entities[id]]));
      return {
        ids: newIds,
        entities: newEntities,
      };
    });

export const makeRemoveOne =
  <T, Structure = EntityState<T>>(deps: EntityAdaptorDeps<T, Structure>) =>
  (id: EntityId): StateReducer<Structure> =>
    makeRemoveMany(deps)([id]);

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
