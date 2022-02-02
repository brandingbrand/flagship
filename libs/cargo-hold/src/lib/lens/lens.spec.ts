import * as FastCheck from 'fast-check';
import { composeLens, LensCreator, withLens, withLenses } from './lens';

describe('lens', () => {
  type NestedStructure = { value: number };
  type Structure = { key: string; nested: NestedStructure };
  const lensCreator = new LensCreator<Structure>();
  const nestedLensCreator = new LensCreator<NestedStructure>();
  const structureLens = lensCreator.fromProp('key');
  const fastCheckStructure = () =>
    FastCheck.record({
      key: FastCheck.string(),
      nested: FastCheck.record({
        value: FastCheck.float(),
      }),
    });

  it('gets values', () => {
    FastCheck.assert(
      FastCheck.property(fastCheckStructure(), (structure) => {
        expect(structureLens.get(structure)).toBe(structure.key);
      })
    );
  });
  it('sets values', () => {
    FastCheck.assert(
      FastCheck.property(fastCheckStructure(), FastCheck.string(), (structure, input) => {
        expect(structureLens.set(input)(structure)).toEqual({ ...structure, key: input });
      })
    );
  });

  it('composes 2 lenses', () => {
    const outerLens = lensCreator.fromProp('nested');
    const innerLens = nestedLensCreator.fromProp('value');
    const composedLens = composeLens(innerLens)(outerLens);
    FastCheck.assert(
      FastCheck.property(fastCheckStructure(), FastCheck.float(), (structure, newValue) => {
        expect(composedLens.get(structure)).toBe(structure.nested.value);
        expect(composedLens.set(newValue)(structure)).toEqual({
          ...structure,
          nested: { ...structure.nested, value: newValue },
        });
      })
    );
  });

  it('works on arbitrary keys', () => {
    FastCheck.assert(
      FastCheck.property(
        FastCheck.object(),
        FastCheck.anything({ withObjectString: true, withSet: true, withDate: true, maxKeys: 10 }),
        (structure, newValue) => {
          Object.keys(structure).forEach((key) => {
            const lens = new LensCreator<typeof structure>().fromProp(key);
            expect(lens.get(structure)).toBe(structure[key]);
            expect(lens.set(newValue)(structure)).toEqual({ ...structure, [key]: newValue });
          });
        }
      )
    );
  });
});

describe('withLens', () => {
  type Structure = {
    key1: number;
    key2: number;
  };
  const lensCreator = new LensCreator<Structure>();
  const key1lens = lensCreator.fromProp('key1');
  const key2lens = lensCreator.fromProp('key2');

  it('maps a locally-scoped function to a globally-scoped one', () => {
    FastCheck.assert(
      FastCheck.property(
        FastCheck.record<Structure>({ key1: FastCheck.float(), key2: FastCheck.float() }),
        FastCheck.float(),
        (structure, newValue) => {
          expect(withLens(key1lens)(() => newValue)(structure)).toEqual({
            key1: newValue,
            key2: structure.key2,
          });
        }
      )
    );
  });

  it('correctly allows for access to the outer structure in the inner function', () => {
    FastCheck.assert(
      FastCheck.property(
        FastCheck.record({
          key1: FastCheck.float(),
          key2: FastCheck.float(),
        }),
        (structure) => {
          expect(
            withLens(key1lens)((value, struct) => value + key2lens.get(struct))(structure)
          ).toEqual<Structure>({ key1: structure.key1 + structure.key2, key2: structure.key2 });
        }
      )
    );
  });
});

describe('withLenses', () => {
  type Structure = {
    key1: number;
    key2: number;
  };
  const lensCreator = new LensCreator<Structure>();
  const key1lens = lensCreator.fromProp('key1');
  const key2lens = lensCreator.fromProp('key2');

  it('maps a locally-scoped function to a globally-scoped one', () => {
    FastCheck.assert(
      FastCheck.property(
        FastCheck.record<Structure>({ key1: FastCheck.float(), key2: FastCheck.float() }),
        FastCheck.float(),
        (structure, newValue) => {
          expect(withLenses(key1lens)(() => newValue)(structure)).toEqual({
            key1: newValue,
            key2: structure.key2,
          });
        }
      )
    );
  });

  it('correctly allows for access to the other lenses in the inner function', () => {
    FastCheck.assert(
      FastCheck.property(
        FastCheck.record({
          key1: FastCheck.float(),
          key2: FastCheck.float(),
        }),
        (structure) => {
          expect(
            withLenses(key1lens, key2lens)((value1, value2) => value1 + value2)(structure)
          ).toEqual<Structure>({ key1: structure.key1 + structure.key2, key2: structure.key2 });
        }
      )
    );
  });
});
