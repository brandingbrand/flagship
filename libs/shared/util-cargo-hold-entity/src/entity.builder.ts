import type {
  EntityBuilder,
  WithComparer,
  WithEntityStateLens,
  WithIdSelector,
} from './entity.builder.types';
import type { Comparer, EntityState, EntityStateLens, IdSelector } from './entity.types';

export const entityBuilder = <T, StateType = EntityState<T>>(): EntityBuilder<T, StateType> => ({});

export const withComparer =
  <T, StateType = EntityState<T>>(comparer: Comparer<T>) =>
  <BuilderType extends EntityBuilder<T, StateType>>(
    builder: BuilderType
  ): BuilderType & WithComparer<T> => ({
    ...builder,
    comparer,
  });

export const withEntityStateLens =
  <T, StateType = EntityState<T>>(lens: EntityStateLens<T, StateType>) =>
  <BuilderType extends EntityBuilder<T, StateType>>(
    builder: BuilderType
  ): BuilderType & WithEntityStateLens<T, StateType> => ({
    ...builder,
    lens,
  });

export const withIdSelector =
  <T, StateType = EntityState<T>>(idSelector: IdSelector<T>) =>
  <BuilderType extends EntityBuilder<T, StateType>>(
    builder: BuilderType
  ): BuilderType & WithIdSelector<T> => ({
    ...builder,
    idSelector,
  });
