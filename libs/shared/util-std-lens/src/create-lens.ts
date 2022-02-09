import { ComposableLens } from './composable-lens';
import { ILens } from './types';

const _fromPath = <S>(...keys: PropertyKey[]): ILens<S, unknown> => ({
  get: (structure: S) => keys.reduce((value, key) => (value as any)[key], structure),
  set: (value: any) => (structure: S) => {
    if (!keys.length) {
      return value;
    }
    return {
      ...structure,
      [keys[0]]: _fromPath(...keys.slice(1)).set(value)((structure as any)[keys[0]]),
    };
  },
});

const fromPathTyped = <Structure>() => {
  function fromPath(): ComposableLens<Structure, Structure>;
  function fromPath<Key1 extends keyof Structure>(
    k1: Key1
  ): ComposableLens<Structure, Structure[Key1]>;
  function fromPath<Key1 extends keyof Structure, Key2 extends keyof Structure[Key1]>(
    k1: Key1,
    k2: Key2
  ): ComposableLens<Structure, Structure[Key1][Key2]>;
  function fromPath<
    Key1 extends keyof Structure,
    Key2 extends keyof Structure[Key1],
    Key3 extends keyof Structure[Key1][Key2]
  >(k1: Key1, k2: Key2, k3: Key3): ComposableLens<Structure, Structure[Key1][Key2][Key3]>;
  function fromPath<
    Key1 extends keyof Structure,
    Key2 extends keyof Structure[Key1],
    Key3 extends keyof Structure[Key1][Key2],
    Key4 extends keyof Structure[Key1][Key2][Key3]
  >(
    k1: Key1,
    k2: Key2,
    k3: Key3,
    k4: Key4
  ): ComposableLens<Structure, Structure[Key1][Key2][Key3][Key4]>;
  function fromPath<
    Key1 extends keyof Structure,
    Key2 extends keyof Structure[Key1],
    Key3 extends keyof Structure[Key1][Key2],
    Key4 extends keyof Structure[Key1][Key2][Key3],
    Key5 extends keyof Structure[Key1][Key2][Key3][Key4]
  >(
    k1: Key1,
    k2: Key2,
    k3: Key3,
    k4: Key4,
    k5: Key5
  ): ComposableLens<Structure, Structure[Key1][Key2][Key3][Key4][Key5]>;
  function fromPath(...keys: PropertyKey[]): unknown {
    return new ComposableLens(_fromPath(...keys));
  }
  return fromPath;
};

export const createLens = <Structure>() => ({
  fromPath: fromPathTyped<Structure>(),
});
