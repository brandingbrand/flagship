import type { ILens } from '@brandingbrand/standard-lens';
import type { Comparer, EntityState, IdSelector } from './entity.types';

export type EntityAdaptorDeps<T, Structure> = {
  isSorted: boolean;
  idSelector: IdSelector<T>;
  comparer?: Comparer<T>;
  lens: ILens<Structure, EntityState<T>>;
};
