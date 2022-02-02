import type { Lens } from '../lens/lens.types';
import type { Comparer, EntityState, IdSelector } from './entity.types';

export type EntityAdaptorDeps<T, Structure> = {
  isSorted: boolean;
  idSelector: IdSelector<T>;
  comparer?: Comparer<T>;
  lens: Lens<Structure, EntityState<T>>;
};
