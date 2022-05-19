export interface ILens<Structure, FocussedValue> {
  get: (structure: Structure) => FocussedValue;
  set: (value: FocussedValue) => (structure: Structure) => Structure;
}

export interface ExtendWithPath<Structure, FocussedValue> {
  (): IPathLens<Structure, FocussedValue>;
  <Key1 extends keyof FocussedValue>(key1: Key1): IPathLens<Structure, FocussedValue[Key1]>;
  <Key1 extends keyof FocussedValue, Key2 extends keyof FocussedValue[Key1]>(
    key1: Key1,
    key2: Key2
  ): IPathLens<Structure, FocussedValue[Key1][Key2]>;
  <
    Key1 extends keyof FocussedValue,
    Key2 extends keyof FocussedValue[Key1],
    Key3 extends keyof FocussedValue[Key1][Key2]
  >(
    key1: Key1,
    key2: Key2,
    key3: Key3
  ): IPathLens<Structure, FocussedValue[Key1][Key2][Key3]>;
  <
    Key1 extends keyof FocussedValue,
    Key2 extends keyof FocussedValue[Key1],
    Key3 extends keyof FocussedValue[Key1][Key2],
    Key4 extends keyof FocussedValue[Key1][Key2][Key3]
  >(
    key1: Key1,
    key2: Key2,
    key3: Key3,
    key4: Key4
  ): IPathLens<Structure, FocussedValue[Key1][Key2][Key3][Key4]>;
  <
    Key1 extends keyof FocussedValue,
    Key2 extends keyof FocussedValue[Key1],
    Key3 extends keyof FocussedValue[Key1][Key2],
    Key4 extends keyof FocussedValue[Key1][Key2][Key3],
    Key5 extends keyof FocussedValue[Key1][Key2][Key3][Key4]
  >(
    key1: Key1,
    key2: Key2,
    key3: Key3,
    key4: Key4,
    key5: Key5
  ): IPathLens<Structure, FocussedValue[Key1][Key2][Key3][Key4][Key5]>;
  <
    Key1 extends keyof FocussedValue,
    Key2 extends keyof FocussedValue[Key1],
    Key3 extends keyof FocussedValue[Key1][Key2],
    Key4 extends keyof FocussedValue[Key1][Key2][Key3],
    Key5 extends keyof FocussedValue[Key1][Key2][Key3][Key4],
    Key6 extends keyof FocussedValue[Key1][Key2][Key3][Key4][Key5]
  >(
    key1: Key1,
    key2: Key2,
    key3: Key3,
    key4: Key4,
    key5: Key5,
    key6: Key6
  ): IPathLens<Structure, FocussedValue[Key1][Key2][Key3][Key4][Key5][Key6]>;
  <
    Key1 extends keyof FocussedValue,
    Key2 extends keyof FocussedValue[Key1],
    Key3 extends keyof FocussedValue[Key1][Key2],
    Key4 extends keyof FocussedValue[Key1][Key2][Key3],
    Key5 extends keyof FocussedValue[Key1][Key2][Key3][Key4],
    Key6 extends keyof FocussedValue[Key1][Key2][Key3][Key4][Key5],
    Key7 extends keyof FocussedValue[Key1][Key2][Key3][Key4][Key5][Key6]
  >(
    key1: Key1,
    key2: Key2,
    key3: Key3,
    key4: Key4,
    key5: Key5,
    key6: Key6,
    key7: Key7
  ): IPathLens<Structure, FocussedValue[Key1][Key2][Key3][Key4][Key5][Key6][Key7]>;
  <
    Key1 extends keyof FocussedValue,
    Key2 extends keyof FocussedValue[Key1],
    Key3 extends keyof FocussedValue[Key1][Key2],
    Key4 extends keyof FocussedValue[Key1][Key2][Key3],
    Key5 extends keyof FocussedValue[Key1][Key2][Key3][Key4],
    Key6 extends keyof FocussedValue[Key1][Key2][Key3][Key4][Key5],
    Key7 extends keyof FocussedValue[Key1][Key2][Key3][Key4][Key5][Key6],
    Key8 extends keyof FocussedValue[Key1][Key2][Key3][Key4][Key5][Key6][Key7]
  >(
    key1: Key1,
    key2: Key2,
    key3: Key3,
    key4: Key4,
    key5: Key5,
    key6: Key6,
    key7: Key7,
    key8: Key8
  ): IPathLens<Structure, FocussedValue[Key1][Key2][Key3][Key4][Key5][Key6][Key7][Key8]>;
  <
    Key1 extends keyof FocussedValue,
    Key2 extends keyof FocussedValue[Key1],
    Key3 extends keyof FocussedValue[Key1][Key2],
    Key4 extends keyof FocussedValue[Key1][Key2][Key3],
    Key5 extends keyof FocussedValue[Key1][Key2][Key3][Key4],
    Key6 extends keyof FocussedValue[Key1][Key2][Key3][Key4][Key5],
    Key7 extends keyof FocussedValue[Key1][Key2][Key3][Key4][Key5][Key6],
    Key8 extends keyof FocussedValue[Key1][Key2][Key3][Key4][Key5][Key6][Key7],
    Key9 extends keyof FocussedValue[Key1][Key2][Key3][Key4][Key5][Key6][Key7][Key8]
  >(
    key1: Key1,
    key2: Key2,
    key3: Key3,
    key4: Key4,
    key5: Key5,
    key6: Key6,
    key7: Key7,
    key8: Key8,
    key9: Key9
  ): IPathLens<Structure, FocussedValue[Key1][Key2][Key3][Key4][Key5][Key6][Key7][Key8][Key9]>;
  <
    Key1 extends keyof FocussedValue,
    Key2 extends keyof FocussedValue[Key1],
    Key3 extends keyof FocussedValue[Key1][Key2],
    Key4 extends keyof FocussedValue[Key1][Key2][Key3],
    Key5 extends keyof FocussedValue[Key1][Key2][Key3][Key4],
    Key6 extends keyof FocussedValue[Key1][Key2][Key3][Key4][Key5],
    Key7 extends keyof FocussedValue[Key1][Key2][Key3][Key4][Key5][Key6],
    Key8 extends keyof FocussedValue[Key1][Key2][Key3][Key4][Key5][Key6][Key7],
    Key9 extends keyof FocussedValue[Key1][Key2][Key3][Key4][Key5][Key6][Key7][Key8],
    Key10 extends keyof FocussedValue[Key1][Key2][Key3][Key4][Key5][Key6][Key7][Key8][Key9]
  >(
    key1: Key1,
    key2: Key2,
    key3: Key3,
    key4: Key4,
    key5: Key5,
    key6: Key6,
    key7: Key7,
    key8: Key8,
    key9: Key9,
    key10: Key10
  ): IPathLens<
    Structure,
    FocussedValue[Key1][Key2][Key3][Key4][Key5][Key6][Key7][Key8][Key9][Key10]
  >;
}

export type IPathLens<Structure, FocussedValue> = ILens<Structure, FocussedValue> & {
  withInnerLens: <InnerValue>(
    lens: ILens<FocussedValue, InnerValue>
  ) => IPathLens<Structure, InnerValue>;
  withOuterLens: <OuterValue>(
    lens: ILens<OuterValue, Structure>
  ) => IPathLens<OuterValue, FocussedValue>;
  extendWithPath: ExtendWithPath<Structure, FocussedValue>;
};
