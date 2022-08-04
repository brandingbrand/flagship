import type { ILens } from '@brandingbrand/standard-lens';
import { ComposableLens, createLens } from '@brandingbrand/standard-lens';

import type { Comparer, EntityId, EntityState, IdSelector } from '../entity.types';

import { makeCreateState, makeReducers } from './entity.reducer';
import { getSelectors } from './entity.selectors';
import type { EntityAdaptor } from './entity.types';
import type { EntityAdaptorDeps } from './entity.types.internal';

export type WithDefaultId = Record<'id', EntityId>;

export const defaultIdSelector = <T extends WithDefaultId>(item: T): EntityId => item.id;

export interface CreateEntityAdaptorOptions<T, StateType> {
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
  lens?: ILens<StateType, EntityState<T>>;
}

/**
 * Creates an entity adapter.
 *
 * @param options Options to create the entity adapter.
 * @return
 */
export const createEntityAdaptor = <T, StateTypeType>(
  options: CreateEntityAdaptorOptions<T, StateTypeType>
): EntityAdaptor<T, StateTypeType> => {
  const isSorted = Boolean(options.comparer);
  const structureLens =
    options.lens ??
    (createLens<StateTypeType>().fromPath() as unknown as ILens<StateTypeType, EntityState<T>>);
  const deps: EntityAdaptorDeps<T, StateTypeType> = { ...options, lens: structureLens, isSorted };
  const unlensedDeps: EntityAdaptorDeps<T, EntityState<T>> = {
    ...options,
    isSorted,
    lens: createLens<EntityState<T>>().fromPath(),
  };

  const lensedReducers = makeReducers(deps);
  const reducers = makeReducers(unlensedDeps);

  const withLens = <OuterStateTypeType>(
    lens: ILens<OuterStateTypeType, StateTypeType>
  ): EntityAdaptor<T, OuterStateTypeType> =>
    createEntityAdaptor<T, OuterStateTypeType>({
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
