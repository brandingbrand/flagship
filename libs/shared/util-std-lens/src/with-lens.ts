import { pipe } from '@brandingbrand/standard-compose';
import { ILens } from './types';

export const withLens =
  <Structure, Value>(lens: ILens<Structure, Value>) =>
  (fn: (val: Value, structure: Structure) => Value) =>
  (structure: Structure): Structure =>
    pipe(
      structure,
      lens.get,
      (value) => fn(value, structure),
      lens.set,
      (setter) => setter(structure)
    );
