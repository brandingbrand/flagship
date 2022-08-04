import type { Comparer, EntityStateLens, IdSelector } from '../entity.types';

export interface EntityAdaptorDeps<T, StateType> {
  isSorted: boolean;
  idSelector: IdSelector<T>;
  comparer?: Comparer<T>;
  lens: EntityStateLens<T, StateType>;
}
