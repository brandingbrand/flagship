import { compare } from './compare.util';

const emptySchema = {};

describe('compare', () => {
  it('should produce the same result from the jsdoc', () => {
    const schema1 = {
      title: 'title 1',
      type: ['object'],
      uniqueItems: false,
      dependencies: {
        name: ['age', 'lastName'],
      },
      required: ['age', 'name'],
    };

    const schema2 = {
      title: 'title 2',
      type: 'object',
      required: ['age', 'name'],
      dependencies: {
        name: ['lastName', 'age'],
      },
      properties: {
        name: {
          minLength: 0,
        },
      },
    };

    const options = {
      ignore: ['title'],
    };

    expect(compare(schema1, schema2, options)).toBe(false);
  });

  it('compares false and undefined', () => {
    expect(compare(undefined, false)).toBe(false);
  });

  it('compares required unsorted', () => {
    const schema1 = {
      required: ['test', 'rest'],
    };
    const schema2 = {
      required: ['rest', 'test', 'rest'],
    };

    expect(compare(schema1, schema2)).toBe(true);
  });

  it('compares equal required empty array and undefined', () => {
    const noRequired = {
      required: [],
    };

    const someRequired = {
      required: ['fds'],
    };

    expect(compare(noRequired, emptySchema)).toBe(true);
    expect(compare(someRequired, emptySchema)).toBe(false);
  });

  it('compares equal properties empty object and undefined', () => {
    const noProperties = {
      properties: {},
    };

    expect(compare(noProperties, emptySchema)).toBe(true);
  });

  it('compares properties', () => {
    const properties1 = {
      properties: {
        foo: {
          type: 'string',
        },
      },
    };

    const properties2 = {
      properties: {
        foo: {
          type: 'string',
        },
      },
    };

    expect(compare(properties1, properties2)).toBe(true);
  });

  it('compares equal patternProperties empty object and undefined', () => {
    const noPatternProperties = {
      patternProperties: {},
    };

    expect(compare(noPatternProperties, emptySchema)).toBe(true);
  });

  it('compares equal dependencies empty object and undefined', () => {
    const noDependencies = {
      dependencies: {},
    };

    expect(compare(noDependencies, emptySchema)).toBe(true);
  });

  it('compares type unsorted', () => {
    const noTypes = {
      type: {},
    };

    const type = {
      type: 'string',
    };

    const typeArray1 = {
      type: ['string'],
    };

    const typeArray2 = {
      type: ['string', 'array'],
    };

    const typeArray3 = {
      type: ['array', 'string', 'array'],
    };

    expect(compare(noTypes, emptySchema)).toBe(false);
    expect(compare(type, typeArray1)).toBe(true);
    expect(compare(typeArray2, typeArray3)).toBe(true);
  });

  it('compares equal an empty schema, true and undefined', () => {
    expect(compare(emptySchema, true)).toBe(true);
    expect(compare(emptySchema, undefined)).toBe(true);
    expect(compare(false, false)).toBe(true);
    expect(compare(true, true)).toBe(true);
  });

  it('ignores any in ignore list', () => {
    const title1 = {
      title: 'title',
    };

    const title2 = {
      title: 'foobar',
    };

    const options = {
      ignore: ['title'],
    };

    expect(compare(title1, title2, options)).toBe(true);
  });

  it('diffs this', () => {
    const withMinLength = {
      type: ['string'],
      minLength: 5,
    };

    const withoutMinLength = {
      type: ['string'],
    };

    expect(compare(withMinLength, withoutMinLength)).toBe(false);
  });

  it('sorts anyOf before comparing', () => {
    const anyOf1 = {
      anyOf: [
        {
          type: 'string',
        },
        {
          type: 'integer',
        },
      ],
    };

    const anyOf2 = {
      anyOf: [
        {
          type: 'integer',
        },
        {
          type: 'string',
        },
      ],
    };

    const anyOf3 = {
      anyOf: [
        {
          type: 'string',
        },
        {
          type: 'integer',
        },
      ],
    };

    const anyOf4 = {
      anyOf: [
        {
          type: 'integer',
        },
        {
          type: 'string',
        },
        {
          type: ['string'],
          minLength: 5,
          fdsafads: '34534',
        },
      ],
    };

    const anyOf5 = {
      anyOf: [
        {
          type: 'string',
        },
        {
          type: 'integer',
        },
      ],
    };

    const anyOf6 = {
      anyOf: [
        {
          type: 'integer',
        },
        {
          type: 'array',
        },
      ],
    };

    const anyOf7 = {
      anyOf: [
        {
          type: 'string',
        },
        {
          type: ['string'],
        },
        {
          type: 'integer',
        },
      ],
    };

    const anyOf8 = {
      anyOf: [
        {
          type: 'integer',
        },
        {
          type: 'string',
        },
      ],
    };

    expect(compare(anyOf1, anyOf2)).toBe(true);
    expect(compare(anyOf3, anyOf4)).toBe(false);
    expect(compare(anyOf5, anyOf6)).toBe(false);
    expect(compare(anyOf7, anyOf8)).toBe(true);
  });

  it('sorts allOf before comparing', () => {
    const allOf1 = {
      allOf: [
        {
          type: 'string',
        },
        {
          type: 'integer',
        },
      ],
    };
    const allOf2 = {
      allOf: [
        {
          type: 'integer',
        },
        {
          type: 'string',
        },
      ],
    };

    const allOf3 = {
      allOf: [
        {
          type: 'string',
        },
        {
          type: 'integer',
        },
      ],
    };

    const allOf4 = {
      allOf: [
        {
          type: 'integer',
        },
        {
          type: 'string',
        },
        {
          type: ['string'],
          minLength: 5,
          fdsafads: '34534',
        },
      ],
    };

    const allOf5 = {
      allOf: [
        {
          type: 'string',
        },
        {
          type: 'integer',
        },
      ],
    };

    const allOf6 = {
      allOf: [
        {
          type: 'integer',
        },
        {
          type: 'array',
        },
      ],
    };

    const allOf7 = {
      allOf: [
        {
          type: 'string',
        },
        {
          type: ['string'],
        },
        {
          type: 'integer',
        },
      ],
    };

    const allOf8 = {
      allOf: [
        {
          type: 'integer',
        },
        {
          type: 'string',
        },
      ],
    };

    expect(compare(allOf1, allOf2)).toBe(true);
    expect(compare(allOf3, allOf4)).toBe(false);
    expect(compare(allOf5, allOf6)).toBe(false);
    expect(compare(allOf7, allOf8)).toBe(true);
  });

  it('sorts oneOf before comparing', () => {
    const oneOf1 = {
      oneOf: [
        {
          type: 'string',
        },
        {
          type: 'integer',
        },
      ],
    };

    const oneOf2 = {
      oneOf: [
        {
          type: 'integer',
        },
        {
          type: 'string',
        },
      ],
    };

    const oneOf3 = {
      oneOf: [
        {
          type: 'string',
        },
        {
          type: 'integer',
        },
      ],
    };

    const oneOf4 = {
      oneOf: [
        {
          type: 'integer',
        },
        {
          type: 'string',
        },
        {
          type: ['string'],
          minLength: 5,
          fdsafads: '34534',
        },
      ],
    };

    const oneOf5 = {
      oneOf: [
        {
          type: 'string',
        },
        {
          type: 'integer',
        },
      ],
    };

    const oneOf6 = {
      oneOf: [
        {
          type: 'integer',
        },
        {
          type: 'array',
        },
      ],
    };

    const oneOf7 = {
      oneOf: [
        {
          type: 'string',
        },
        {
          type: ['string'],
        },
        {
          type: 'integer',
        },
      ],
    };

    const oneOf8 = {
      oneOf: [
        {
          type: 'integer',
        },
        {
          type: 'string',
        },
      ],
    };

    expect(compare(oneOf1, oneOf2)).toBe(true);
    expect(compare(oneOf3, oneOf4)).toBe(false);
    expect(compare(oneOf5, oneOf6)).toBe(false);
    expect(compare(oneOf7, oneOf8)).toBe(true);
  });

  it('compares enum unsorted', () => {
    const enum1 = {
      enum: ['abc', '123'],
    };
    const enum2 = {
      enum: ['123', 'abc', 'abc'],
    };

    expect(compare(enum1, enum2)).toBe(true);
  });

  it('compares dependencies value if array unsorted', () => {
    const dependencies1 = {
      dependencies: {
        foo: ['abc', '123'],
      },
    };

    const dependencies2 = {
      dependencies: {
        foo: ['123', 'abc', 'abc'],
      },
    };

    expect(compare(dependencies1, dependencies2)).toBe(true);
  });

  it('compares items SORTED', () => {
    const items1 = {
      items: [true, false],
    };
    const items2 = {
      items: [true, true],
    };
    const items3 = {
      items: [{}, false],
    };
    const items4 = {
      items: [true, false],
    };

    expect(compare(items1, items2)).toBe(false);
    expect(compare(items3, items4)).toBe(true);
  });

  it('compares equal uniqueItems false and undefined', () => {
    const uniqueItems = {
      uniqueItems: false,
    };

    expect(compare(uniqueItems, emptySchema)).toBe(true);
  });

  it('compares equal minLength undefined and 0', () => {
    const minLength = {
      minLength: 0,
    };

    expect(compare(minLength, emptySchema)).toBe(true);
  });
  it('compares equal minItems undefined and 0', () => {
    const minItems = {
      minItems: 0,
    };

    expect(compare(minItems, emptySchema)).toBe(true);
  });

  it('compares equal minProperties undefined and 0', () => {
    const minProperties = {
      minProperties: 0,
    };

    expect(compare(minProperties, emptySchema)).toBe(true);
  });
});
