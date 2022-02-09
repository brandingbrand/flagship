import { ILens } from './types';

export const withLenses =
  <Structure, Value, Values extends unknown[]>(
    lens: ILens<Structure, Value>,
    ...secondaryLenses: { [K in keyof Values]: ILens<Structure, Values[K]> }
  ) =>
  (fn: (value: Value, ...values: Values) => Value) =>
  (structure: Structure): Structure => {
    const values = secondaryLenses.map((secondaryLens) => secondaryLens.get(structure));
    return lens.set(fn(lens.get(structure), ...(values as Values)))(structure);
  };
