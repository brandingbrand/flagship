import { ComposableLens } from './composable-lens';
import type { ILens } from './types';

const _fromPath = <S>(...keys: PropertyKey[]): ILens<S, unknown> => ({
  get: (structure: S) => keys.reduce((value, key) => (value as any)?.[key], structure),
  set: (value: any) => (structure: S) => {
    const firstKey = keys[0];
    if (firstKey === undefined) {
      return value;
    }

    return {
      ...structure,
      [firstKey]: _fromPath(...keys.slice(1)).set(value)((structure as any)[firstKey]),
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
  function fromPath<
    Key1 extends keyof Structure,
    Key2 extends keyof Structure[Key1],
    Key3 extends keyof Structure[Key1][Key2],
    Key4 extends keyof Structure[Key1][Key2][Key3],
    Key5 extends keyof Structure[Key1][Key2][Key3][Key4],
    Key6 extends keyof Structure[Key1][Key2][Key3][Key4][Key5]
  >(
    k1: Key1,
    k2: Key2,
    k3: Key3,
    k4: Key4,
    k5: Key5,
    k6: Key6
  ): ComposableLens<Structure, Structure[Key1][Key2][Key3][Key4][Key5][Key6]>;
  function fromPath<
    Key1 extends keyof Structure,
    Key2 extends keyof Structure[Key1],
    Key3 extends keyof Structure[Key1][Key2],
    Key4 extends keyof Structure[Key1][Key2][Key3],
    Key5 extends keyof Structure[Key1][Key2][Key3][Key4],
    Key6 extends keyof Structure[Key1][Key2][Key3][Key4][Key5],
    Key7 extends keyof Structure[Key1][Key2][Key3][Key4][Key5][Key6]
  >(
    k1: Key1,
    k2: Key2,
    k3: Key3,
    k4: Key4,
    k5: Key5,
    k6: Key6,
    k7: Key7
  ): ComposableLens<Structure, Structure[Key1][Key2][Key3][Key4][Key5][Key6][Key7]>;
  function fromPath<
    Key1 extends keyof Structure,
    Key2 extends keyof Structure[Key1],
    Key3 extends keyof Structure[Key1][Key2],
    Key4 extends keyof Structure[Key1][Key2][Key3],
    Key5 extends keyof Structure[Key1][Key2][Key3][Key4],
    Key6 extends keyof Structure[Key1][Key2][Key3][Key4][Key5],
    Key7 extends keyof Structure[Key1][Key2][Key3][Key4][Key5][Key6],
    Key8 extends keyof Structure[Key1][Key2][Key3][Key4][Key5][Key6][Key7]
  >(
    k1: Key1,
    k2: Key2,
    k3: Key3,
    k4: Key4,
    k5: Key5,
    k6: Key6,
    k7: Key7,
    k8: Key8
  ): ComposableLens<Structure, Structure[Key1][Key2][Key3][Key4][Key5][Key6][Key7][Key8]>;
  function fromPath<
    Key1 extends keyof Structure,
    Key2 extends keyof Structure[Key1],
    Key3 extends keyof Structure[Key1][Key2],
    Key4 extends keyof Structure[Key1][Key2][Key3],
    Key5 extends keyof Structure[Key1][Key2][Key3][Key4],
    Key6 extends keyof Structure[Key1][Key2][Key3][Key4][Key5],
    Key7 extends keyof Structure[Key1][Key2][Key3][Key4][Key5][Key6],
    Key8 extends keyof Structure[Key1][Key2][Key3][Key4][Key5][Key6][Key7],
    Key9 extends keyof Structure[Key1][Key2][Key3][Key4][Key5][Key6][Key7][Key8]
  >(
    k1: Key1,
    k2: Key2,
    k3: Key3,
    k4: Key4,
    k5: Key5,
    k6: Key6,
    k7: Key7,
    k8: Key8,
    k9: Key9
  ): ComposableLens<Structure, Structure[Key1][Key2][Key3][Key4][Key5][Key6][Key7][Key8][Key9]>;
  function fromPath<
    Key1 extends keyof Structure,
    Key2 extends keyof Structure[Key1],
    Key3 extends keyof Structure[Key1][Key2],
    Key4 extends keyof Structure[Key1][Key2][Key3],
    Key5 extends keyof Structure[Key1][Key2][Key3][Key4],
    Key6 extends keyof Structure[Key1][Key2][Key3][Key4][Key5],
    Key7 extends keyof Structure[Key1][Key2][Key3][Key4][Key5][Key6],
    Key8 extends keyof Structure[Key1][Key2][Key3][Key4][Key5][Key6][Key7],
    Key9 extends keyof Structure[Key1][Key2][Key3][Key4][Key5][Key6][Key7][Key8],
    Key10 extends keyof Structure[Key1][Key2][Key3][Key4][Key5][Key6][Key7][Key8][Key9]
  >(
    k1: Key1,
    k2: Key2,
    k3: Key3,
    k4: Key4,
    k5: Key5,
    k6: Key6,
    k7: Key7,
    k8: Key8,
    k9: Key9,
    k10: Key10
  ): ComposableLens<
    Structure,
    Structure[Key1][Key2][Key3][Key4][Key5][Key6][Key7][Key8][Key9][Key10]
  >;
  function fromPath(...keys: PropertyKey[]): ComposableLens<Structure, unknown>;
  /**
   *
   * @param keys
   * @return
   */
  function fromPath(...keys: PropertyKey[]): unknown {
    return new ComposableLens(_fromPath(...keys));
  }
  return fromPath;
};

/**
 * @deprecated use createLensCreator instead.
 */
export const createLens = <Structure>() => ({
  fromPath: fromPathTyped<Structure>(),
});

export const createLensCreator = createLens;
