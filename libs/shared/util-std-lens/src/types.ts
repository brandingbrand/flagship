export type ILens<Structure, FocussedValue> = {
  get: (structure: Structure) => FocussedValue;
  set: (value: FocussedValue) => (structure: Structure) => Structure;
};
