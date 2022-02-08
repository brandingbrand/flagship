import { makeReducers } from '.';
import { composeLens, LensCreator, Lens } from '../lens';
import { makeCreateState } from './entity.reducer';
import { getSelectors } from './entity.selectors';
import type { Comparer, EntityAdaptor, EntityState, IdSelector } from './entity.types';
import type { EntityAdaptorDeps } from './entity.types.internal';

export const defaultIdSelector = <T extends { id: string | number }>(item: T) => item.id;

export type CreateEntityAdaptorOptions<T, Structure> = {
  idSelector: IdSelector<T>;
  comparer?: Comparer<T>;
  lens?: Lens<Structure, EntityState<T>>;
};

export const createEntityAdaptor = <T, Structure>(
  options: CreateEntityAdaptorOptions<T, Structure>
): EntityAdaptor<T, Structure> => {
  const isSorted: boolean = !!options.comparer;
  const structureLens =
    options.lens ??
    (new LensCreator<Structure>().id() as unknown as Lens<Structure, EntityState<T>>);
  const deps: EntityAdaptorDeps<T, Structure> = { ...options, lens: structureLens, isSorted };
  const unlensedDeps: EntityAdaptorDeps<T, EntityState<T>> = {
    ...options,
    isSorted,
    lens: new LensCreator<EntityState<T>>().id(),
  };

  const lensedReducers = makeReducers(deps);
  const reducers = makeReducers(unlensedDeps);

  const withLens = <OuterStructure>(lens: Lens<OuterStructure, Structure>) =>
    createEntityAdaptor<T, OuterStructure>({
      ...options,
      lens: composeLens(structureLens)(lens),
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
