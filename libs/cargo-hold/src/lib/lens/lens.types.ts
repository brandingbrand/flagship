export type Lens<Structure, Value> = {
  readonly get: (structure: Structure) => Value;
  readonly set: (value: Value) => (structure: Structure) => Structure;
};
