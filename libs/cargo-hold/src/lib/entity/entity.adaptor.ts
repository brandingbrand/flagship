import type { ILens } from '@brandingbrand/standard-lens';
import { ComposableLens, createLens } from '@brandingbrand/standard-lens';

import { makeCreateState, makeReducers } from './entity.reducer';
import { getSelectors } from './entity.selectors';
import type { Comparer, EntityAdaptor, EntityState, IdSelector } from './entity.types';
import type { EntityAdaptorDeps } from './entity.types.internal';

export const defaultIdSelector = <T extends { id: number | string }>(item: T) => item.id;

export interface CreateEntityAdaptorOptions<T, Structure> {
  /**
   * A function that can get an entityId out of the entity
   */
  idSelector: IdSelector<T>;
  /**
   * An optional comparison function that compares two entities for order. If this is not defined
   * order is not guaranteed
   */
  comparer?: Comparer<T>;
  /**
   * Optional lens that allows the adaptor to operate on larger data structures.
   */
  lens?: ILens<Structure, EntityState<T>>;
}

/**
 * Creates an entity adapter.
 *
 * @param options Options to create the entity adapter.
 * @return
 */
export const createEntityAdaptor = <T, StructureType>(
  options: CreateEntityAdaptorOptions<T, StructureType>
): EntityAdaptor<T, StructureType> => {
  const isSorted = Boolean(options.comparer);
  const structureLens =
    options.lens ??
    (createLens<StructureType>().fromPath() as unknown as ILens<StructureType, EntityState<T>>);
  const deps: EntityAdaptorDeps<T, StructureType> = { ...options, lens: structureLens, isSorted };
  const unlensedDeps: EntityAdaptorDeps<T, EntityState<T>> = {
    ...options,
    isSorted,
    lens: createLens<EntityState<T>>().fromPath(),
  };

  const lensedReducers = makeReducers(deps);
  const reducers = makeReducers(unlensedDeps);

  const withLens = <OuterStructureType>(
    lens: ILens<OuterStructureType, StructureType>
  ): EntityAdaptor<T, OuterStructureType> =>
    createEntityAdaptor<T, OuterStructureType>({
      ...options,
      lens: new ComposableLens(structureLens).withOuterLens(lens),
    });

  const selectors = getSelectors(structureLens);
  const empty: EntityState<T> = {
    entities: {},
    ids: [],
  };
  const createState = makeCreateState(deps);

  return {
    createState,
    empty,
    lensedReducers,
    reducers,
    selectors,
    withLens,
  };
};

/**
 * A constant that is a good initial state for any entity state.
 */
export const EMPTY_ENTITY_STATE: EntityState<never> = {
  entities: {},
  ids: [],
};
