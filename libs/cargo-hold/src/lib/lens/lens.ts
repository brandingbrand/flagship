import { pipe } from '../internal/util/functional/pipe';
import type { Lens } from './lens.types';

export class LensCreator<Structure> {
  public readonly fromProp = <Prop extends keyof Structure>(
    prop: Prop
  ): Lens<Structure, Structure[Prop]> => ({
    get: (structure) => structure[prop],
    set: (value) => (structure) => ({ ...structure, [prop]: value }),
  });

  public readonly id = (): Lens<Structure, Structure> => ({
    get: (structure) => structure,
    set: (value) => (_structure) => value,
  });
}

export const composeLens =
  <A, B>(secondaryLens: Lens<A, B>) =>
  <Structure>(primaryLens: Lens<Structure, A>): Lens<Structure, B> => ({
    get: (structure) => secondaryLens.get(primaryLens.get(structure)),
    set: (value) => (structure) =>
      pipe(structure, primaryLens.get, secondaryLens.set(value), primaryLens.set, (setter) =>
        setter(structure)
      ),
  });

export const withLens =
  <Structure, Value>(lens: Lens<Structure, Value>) =>
  (fn: (val: Value, structure: Structure) => Value) =>
  (structure: Structure): Structure =>
    pipe(
      structure,
      lens.get,
      (value) => fn(value, structure),
      lens.set,
      (setter) => setter(structure)
    );

export const withLenses =
  <Structure, Value, Values extends unknown[]>(
    lens: Lens<Structure, Value>,
    ...secondaryLenses: { [K in keyof Values]: Lens<Structure, Values[K]> }
  ) =>
  (fn: (value: Value, ...values: Values) => Value) =>
  (structure: Structure): Structure => {
    const values = secondaryLenses.map((secondaryLens) => secondaryLens.get(structure));
    return lens.set(fn(lens.get(structure), ...(values as Values)))(structure);
  };
