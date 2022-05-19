import type { ILens } from '@brandingbrand/standard-lens';
import { ComposableLens, createLens } from '@brandingbrand/standard-lens';

import { makeCreateState, makeReducers } from './entity.reducer';
import { getSelectors } from './entity.selectors';
import type { Comparer, EntityAdaptor, EntityState, IdSelector } from './entity.types';
import type { EntityAdaptorDeps } from './entity.types.internal';

export const defaultIdSelector = <T extends { id: number | string }>(item: T) => item.id;

export interface CreateEntityAdaptorOptions<T, Structure> {
  idSelector: IdSelector<T>;
  comparer?: Comparer<T>;
  lens?: ILens<Structure, EntityState<T>>;
}

export const createEntityAdaptor = <T, Structure>(
  options: CreateEntityAdaptorOptions<T, Structure>
): EntityAdaptor<T, Structure> => {
  const isSorted = Boolean(options.comparer);
  const structureLens =
    options.lens ??
    (createLens<Structure>().fromPath() as unknown as ILens<Structure, EntityState<T>>);
  const deps: EntityAdaptorDeps<T, Structure> = { ...options, lens: structureLens, isSorted };
  const unlensedDeps: EntityAdaptorDeps<T, EntityState<T>> = {
    ...options,
    isSorted,
    lens: createLens<EntityState<T>>().fromPath(),
  };

  const lensedReducers = makeReducers(deps);
  const reducers = makeReducers(unlensedDeps);

  const withLens = <OuterStructure>(lens: ILens<OuterStructure, Structure>) =>
    createEntityAdaptor<T, OuterStructure>({
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

export const EMPTY_ENTITY_STATE: EntityState<never> = {
  entities: {},
  ids: [],
};
