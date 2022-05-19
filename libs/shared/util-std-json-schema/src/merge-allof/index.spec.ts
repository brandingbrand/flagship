import { intersection } from '@brandingbrand/standard-array';

import AJV from 'ajv';
import type { JSONSchema7, JSONSchema7Definition } from 'json-schema';

import { notUndefined } from './common';

import { mergeAllOf } from '.';

const ajv = new AJV();

const mergeAndValidate = (schema: JSONSchema7) => {
  const result = mergeAllOf(schema);
  try {
    if (!ajv.validateSchema(result)) {
      throw new Error("Schema returned by resolver isn't valid.");
    }
    return result;
  } catch (error: unknown) {
    console.log(error);
    if (error instanceof Error && !/stack/i.test(error.message)) {
      throw error;
    }
  }
};

describe('mergeAllOf', () => {
  it('merges schema with same object reference multiple places', () => {
    const commonSchema = {
      allOf: [
        {
          properties: {
            test: true,
          },
        },
      ],
    };
    const result = mergeAndValidate({
      properties: {
        list: {
          items: commonSchema,
        },
      },
      allOf: [commonSchema],
    });

    expect(result).toStrictEqual({
      properties: {
        list: {
          items: {
            properties: {
              test: true,
            },
          },
        },
        test: true,
      },
    });
  });

  it('does not alter original schema', () => {
    const schema = {
      allOf: [
        {
          properties: {
            test: true,
          },
        },
      ],
    };

    const result = mergeAndValidate(schema);

    expect(result).toStrictEqual({
      properties: {
        test: true,
      },
    });

    expect(result).not.toBe(schema); // not strict equal (identity)
    expect(schema).toStrictEqual({
      allOf: [
        {
          properties: {
            test: true,
          },
        },
      ],
    });
  });

  it('does not use any original objects or arrays', () => {
    const schema: JSONSchema7 = {
      properties: {
        arr: {
          type: 'array',
          items: {
            type: 'object',
          },
          additionalItems: {
            type: 'array',
          },
        },
      },
      allOf: [
        {
          properties: {
            test: true,
          },
        },
      ],
    };

    const innerDeconstruct = (schema: JSONSchema7Definition): JSONSchema7Definition[] => {
      const allChildObj = Object.entries(schema).map(([key, val]) => {
        if (typeof val === 'object') {
          return innerDeconstruct(val);
        }
        return undefined;
      });

      return [schema, ...allChildObj.filter(notUndefined).flat()];
    };

    const getAllObjects = (schema: JSONSchema7Definition | undefined) =>
      innerDeconstruct(schema ?? {}).flat();
    const inputObjects = getAllObjects(schema);

    const result = mergeAndValidate(schema);
    const resultObjects = getAllObjects(result);

    const commonObjects = intersection(inputObjects, resultObjects);

    expect(commonObjects).toHaveLength(0);
  });

  it('combines simple usecase', () => {
    const result = mergeAndValidate({
      allOf: [
        {
          type: 'string',
          minLength: 1,
        },
        {
          type: 'string',
          maxLength: 5,
        },
      ],
    });

    expect(result).toStrictEqual({
      type: 'string',
      minLength: 1,
      maxLength: 5,
    });
  });

  it('combines without allOf', () => {
    const result = mergeAndValidate({
      properties: {
        foo: {
          type: 'string',
        },
      },
    });

    expect(result).toStrictEqual({
      properties: {
        foo: {
          type: 'string',
        },
      },
    });
  });

  describe('simple resolve functionality', () => {
    it('merges with default resolver if not defined resolver', () => {
      const result = mergeAndValidate({
        title: 'schema1',
        allOf: [
          {
            title: 'schema2',
          },
          {
            title: 'schema3',
          },
        ],
      });

      expect(result).toStrictEqual({
        title: 'schema1',
      });

      const result2 = mergeAndValidate({
        allOf: [
          {
            title: 'schema2',
          },
          {
            title: 'schema3',
          },
        ],
      });

      expect(result2).toStrictEqual({
        title: 'schema2',
      });
    });

    it('merges minLength if conflict', () => {
      const result = mergeAndValidate({
        allOf: [
          {
            minLength: 1,
          },
          {
            minLength: 5,
          },
        ],
      });

      expect(result).toStrictEqual({
        minLength: 5,
      });
    });

    it('merges minimum if conflict', () => {
      const result = mergeAndValidate({
        allOf: [
          {
            minimum: 1,
          },
          {
            minimum: 5,
          },
        ],
      });

      expect(result).toStrictEqual({
        minimum: 5,
      });
    });

    it('merges exclusiveMinimum if conflict', () => {
      const result = mergeAndValidate({
        allOf: [
          {
            exclusiveMinimum: 1,
          },
          {
            exclusiveMinimum: 5,
          },
        ],
      });

      expect(result).toStrictEqual({
        exclusiveMinimum: 5,
      });
    });

    it('merges minItems if conflict', () => {
      const result = mergeAndValidate({
        allOf: [
          {
            minItems: 1,
          },
          {
            minItems: 5,
          },
        ],
      });

      expect(result).toStrictEqual({
        minItems: 5,
      });
    });

    it('merges maximum if conflict', () => {
      const result = mergeAndValidate({
        allOf: [
          {
            maximum: 1,
          },
          {
            maximum: 5,
          },
        ],
      });

      expect(result).toStrictEqual({
        maximum: 1,
      });
    });

    it('merges exclusiveMaximum if conflict', () => {
      const result = mergeAndValidate({
        allOf: [
          {
            exclusiveMaximum: 1,
          },
          {
            exclusiveMaximum: 5,
          },
        ],
      });

      expect(result).toStrictEqual({
        exclusiveMaximum: 1,
      });
    });

    it('merges maxItems if conflict', () => {
      const result = mergeAndValidate({
        allOf: [
          {
            maxItems: 1,
          },
          {
            maxItems: 5,
          },
        ],
      });

      expect(result).toStrictEqual({
        maxItems: 1,
      });
    });

    it('merges maxLength if conflict', () => {
      const result = mergeAndValidate({
        allOf: [
          {
            maxLength: 4,
          },
          {
            maxLength: 5,
          },
        ],
      });

      expect(result).toStrictEqual({
        maxLength: 4,
      });
    });

    it('merges uniqueItems to most restrictive if conflict', () => {
      const result = mergeAndValidate({
        allOf: [
          {
            uniqueItems: true,
          },
          {
            uniqueItems: false,
          },
        ],
      });

      expect(result).toStrictEqual({
        uniqueItems: true,
      });

      expect(
        mergeAndValidate({
          allOf: [
            {
              uniqueItems: false,
            },
            {
              uniqueItems: false,
            },
          ],
        })
      ).toStrictEqual({
        uniqueItems: false,
      });
    });

    it('throws if merging incompatible type', () => {
      expect(() => {
        mergeAndValidate({
          allOf: [
            {
              type: 'null',
            },
            {
              type: 'string',
            },
          ],
        });
      }).toThrow(/incompatible/);
    });

    it('merges type if conflict', () => {
      const result = mergeAndValidate({
        allOf: [
          {},
          {
            type: ['string', 'null', 'object', 'array'],
          },
          {
            type: ['string', 'null'],
          },
          {
            type: ['null', 'string'],
          },
        ],
      });

      expect(result).toStrictEqual({
        type: ['string', 'null'],
      });

      const result2 = mergeAndValidate({
        allOf: [
          {},
          {
            type: ['string', 'null', 'object', 'array'],
          },
          {
            type: 'string',
          },
          {
            type: ['null', 'string'],
          },
        ],
      });

      expect(result2).toStrictEqual({
        type: 'string',
      });

      expect(() => {
        mergeAndValidate({
          allOf: [
            {
              type: ['null'],
            },
            {
              type: ['string', 'object'],
            },
          ],
        });
      }).toThrow(/incompatible/);
    });

    it('merges enum', () => {
      const result = mergeAndValidate({
        allOf: [
          {},
          {
            enum: ['string', 'null', 'object', {}, [2], [1], null],
          },
          {
            enum: ['string', {}, [1], [1]],
          },
          {
            enum: ['null', 'string', {}, [3], [1], null],
          },
        ],
      });

      expect(result).toStrictEqual({
        enum: [[1], {}, 'string'],
      });
    });

    it('throws if enum is incompatible', () => {
      expect(() => {
        mergeAndValidate({
          allOf: [
            {},
            {
              enum: ['string', {}],
            },
            {
              enum: [{}, 'string'],
            },
          ],
        });
      }).not.toThrow(/incompatible/);

      expect(() => {
        mergeAndValidate({
          allOf: [
            {},
            {
              enum: ['string', {}],
            },
            {
              enum: [[], false],
            },
          ],
        });
      }).toThrow(/incompatible/);
    });

    it('merges const', () => {
      const result = mergeAndValidate({
        allOf: [
          {},
          {
            const: ['string', {}],
          },
          {
            const: ['string', {}],
          },
        ],
      });

      expect(result).toStrictEqual({
        const: ['string', {}],
      });
    });

    it('merges anyOf', () => {
      const result = mergeAndValidate({
        allOf: [
          {
            anyOf: [
              {
                required: ['123'],
              },
            ],
          },
          {
            anyOf: [
              {
                required: ['123'],
              },
              {
                required: ['456'],
              },
            ],
          },
        ],
      });

      expect(result).toStrictEqual({
        anyOf: [
          {
            required: ['123'],
          },
          {
            required: ['123', '456'],
          },
        ],
      });
    });

    it('merges anyOf by finding valid combinations', () => {
      const result = mergeAndValidate({
        allOf: [
          {
            anyOf: [
              {
                type: ['null', 'string', 'array'],
              },
              {
                type: ['null', 'string', 'object'],
              },
            ],
          },
          {
            anyOf: [
              {
                type: ['null', 'string'],
              },
              {
                type: ['integer', 'object', 'null'],
              },
            ],
          },
        ],
      });

      expect(result).toStrictEqual({
        anyOf: [
          {
            type: ['null', 'string'],
          },
          {
            type: 'null',
          },
          {
            type: ['object', 'null'],
          },
        ],
      });
    });

    it.skip('extracts common logic', () => {
      const result = mergeAndValidate({
        allOf: [
          {
            anyOf: [
              {
                type: ['null', 'string', 'array'],
                minLength: 5,
              },
              {
                type: ['null', 'string', 'object'],
                minLength: 5,
              },
            ],
          },
          {
            anyOf: [
              {
                type: ['null', 'string'],
                minLength: 5,
              },
              {
                type: ['integer', 'object', 'null'],
              },
            ],
          },
        ],
      });

      // TODO I think this is correct
      // TODO implement functionality
      expect(result).toStrictEqual({
        type: 'null',
        minLength: 5,
        anyOf: [
          {
            type: 'string',
          },
        ],
      });
    });

    it.skip('merges anyOf into main schema if left with only one combination', () => {
      const result = mergeAndValidate({
        required: ['abc'],
        allOf: [
          {
            anyOf: [
              {
                required: ['123'],
              },
              {
                required: ['456'],
              },
            ],
          },
          {
            anyOf: [
              {
                required: ['123'],
              },
            ],
          },
        ],
      });

      expect(result).toStrictEqual({
        required: ['abc', '123'],
      });
    });

    it('merges nested allOf if inside singular anyOf', () => {
      const result = mergeAndValidate({
        allOf: [
          {
            anyOf: [
              {
                required: ['123'],
                allOf: [
                  {
                    required: ['768'],
                  },
                ],
              },
            ],
          },
          {
            anyOf: [
              {
                required: ['123'],
              },
              {
                required: ['456'],
              },
            ],
          },
        ],
      });

      expect(result).toStrictEqual({
        anyOf: [
          {
            required: ['123', '768'],
          },
          {
            required: ['123', '456', '768'],
          },
        ],
      });
    });

    it('throws if no intersection at all', () => {
      expect(() => {
        mergeAndValidate({
          allOf: [
            {
              anyOf: [
                {
                  type: ['object', 'string', 'null'],
                },
              ],
            },
            {
              anyOf: [
                {
                  type: ['array', 'integer'],
                },
              ],
            },
          ],
        });
      }).toThrow(/incompatible/);

      expect(() => {
        mergeAndValidate({
          allOf: [
            {
              anyOf: [
                {
                  type: ['object', 'string', 'null'],
                },
              ],
            },
            {
              anyOf: [
                {
                  type: ['array', 'integer'],
                },
              ],
            },
          ],
        });
      }).toThrow(/incompatible/);
    });

    it('merges more complex oneOf', () => {
      const result = mergeAndValidate({
        allOf: [
          {
            oneOf: [
              {
                type: ['array', 'string', 'object'],
                required: ['123'],
              },
              {
                required: ['abc'],
              },
            ],
          },
          {
            oneOf: [
              {
                type: ['string'],
              },
              {
                type: ['object', 'array'],
                required: ['abc'],
              },
            ],
          },
        ],
      });

      expect(result).toStrictEqual({
        oneOf: [
          {
            type: 'string',
            required: ['123'],
          },
          {
            type: ['object', 'array'],
            required: ['123', 'abc'],
          },
          {
            type: ['string'],
            required: ['abc'],
          },
          {
            type: ['object', 'array'],
            required: ['abc'],
          },
        ],
      });
    });

    it('merges nested allOf if inside singular oneOf', () => {
      const result = mergeAndValidate({
        allOf: [
          {
            type: ['array', 'string', 'number'],
            oneOf: [
              {
                required: ['123'],
                allOf: [
                  {
                    required: ['768'],
                  },
                ],
              },
            ],
          },
          {
            type: ['array', 'string'],
          },
        ],
      });

      expect(result).toStrictEqual({
        type: ['array', 'string'],
        oneOf: [
          {
            required: ['123', '768'],
          },
        ],
      });
    });

    it('merges nested allOf if inside multiple oneOf', () => {
      const result = mergeAndValidate({
        allOf: [
          {
            type: ['array', 'string', 'number'],
            oneOf: [
              {
                type: ['array', 'object'],
                allOf: [
                  {
                    type: 'object',
                  },
                ],
              },
            ],
          },
          {
            type: ['array', 'string'],
            oneOf: [
              {
                type: 'string',
              },
              {
                type: 'object',
              },
            ],
          },
        ],
      });

      expect(result).toStrictEqual({
        type: ['array', 'string'],
        oneOf: [
          {
            type: 'object',
          },
        ],
      });
    });

    it.skip('throws if no compatible when merging oneOf', () => {
      expect(() => {
        mergeAndValidate({
          allOf: [
            {},
            {
              oneOf: [
                {
                  required: ['123'],
                },
              ],
            },
            {
              oneOf: [
                {
                  required: ['fdasfd'],
                },
              ],
            },
          ],
        });
      }).toThrow(/incompatible/);

      expect(() => {
        mergeAndValidate({
          allOf: [
            {},
            {
              oneOf: [
                {
                  required: ['123'],
                },
                {
                  properties: {
                    name: {
                      type: 'string',
                    },
                  },
                },
              ],
            },
            {
              oneOf: [
                {
                  required: ['fdasfd'],
                },
              ],
            },
          ],
        });
      }).toThrow(/incompatible/);
    });

    // not ready to implement this yet
    it.skip('merges singular oneOf', () => {
      const result = mergeAndValidate({
        properties: {
          name: {
            type: 'string',
          },
        },
        allOf: [
          {
            properties: {
              name: {
                type: 'string',
                minLength: 10,
              },
            },
          },
          {
            oneOf: [
              {
                required: ['123'],
              },
              {
                properties: {
                  name: {
                    type: 'string',
                    minLength: 15,
                  },
                },
              },
            ],
          },
          {
            oneOf: [
              {
                required: ['abc'],
              },
              {
                properties: {
                  name: {
                    type: 'string',
                    minLength: 15,
                  },
                },
              },
            ],
          },
        ],
      });

      expect(result).toStrictEqual({
        properties: {
          name: {
            type: 'string',
            minLength: 15,
          },
        },
      });
    });

    it('merges not using allOf', () => {
      const result = mergeAndValidate({
        allOf: [
          {
            not: {
              properties: {
                name: {
                  type: 'string',
                },
              },
            },
          },
          {
            not: {
              properties: {
                name: {
                  type: ['string', 'null'],
                },
              },
            },
          },
        ],
      });

      expect(result).toStrictEqual({
        not: {
          anyOf: [
            {
              properties: {
                name: {
                  type: 'string',
                },
              },
            },
            {
              properties: {
                name: {
                  type: ['string', 'null'],
                },
              },
            },
          ],
        },
      });
    });

    it('merges contains', () => {
      const result = mergeAndValidate({
        allOf: [
          {},
          {
            contains: {
              properties: {
                name: {
                  type: 'string',
                  pattern: 'bar',
                },
              },
            },
          },
          {
            contains: {
              properties: {
                name: {
                  type: 'string',
                  pattern: 'foo',
                },
              },
            },
          },
        ],
      });

      expect(result).toStrictEqual({
        contains: {
          properties: {
            name: {
              type: 'string',
              pattern: '(?=bar)(?=foo)',
            },
          },
        },
      });
    });

    it('merges pattern using allOf', () => {
      const result = mergeAndValidate({
        allOf: [
          {},
          {
            pattern: 'fdsaf',
          },
          {
            pattern: 'abba',
          },
        ],
      });

      expect(result).toStrictEqual({
        pattern: '(?=fdsaf)(?=abba)',
      });

      const result2 = mergeAndValidate({
        allOf: [
          {
            pattern: 'abba',
          },
        ],
      });

      expect(result2).toStrictEqual({
        pattern: 'abba',
      });
    });

    it.todo('extracts pattern from anyOf and oneOf using | operator in regexp');

    it.skip('merges multipleOf using allOf or direct assignment', () => {
      const result = mergeAndValidate({
        allOf: [
          {
            title: 'foo',
            type: ['number', 'integer'],
            multipleOf: 2,
          },
          {
            type: 'integer',
            multipleOf: 3,
          },
        ],
      });

      expect(result).toStrictEqual({
        type: 'integer',
        title: 'foo',
        allOf: [
          {
            multipleOf: 2,
          },
          {
            multipleOf: 3,
          },
        ],
      });

      const result2 = mergeAndValidate({
        allOf: [
          {
            multipleOf: 1,
          },
        ],
      });

      expect(result2).toStrictEqual({
        multipleOf: 1,
      });
    });

    it('merges multipleOf by finding lowest common multiple (LCM)', () => {
      const result = mergeAndValidate({
        allOf: [
          {},
          {
            multipleOf: 0.2,
            allOf: [
              {
                multipleOf: 2,
                allOf: [
                  {
                    multipleOf: 2,
                    allOf: [
                      {
                        multipleOf: 2,
                        allOf: [
                          {
                            multipleOf: 3,
                            allOf: [
                              {
                                multipleOf: 1.5,
                                allOf: [
                                  {
                                    multipleOf: 0.5,
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            multipleOf: 0.3,
          },
        ],
      });

      expect(result).toStrictEqual({
        multipleOf: 6,
      });

      expect(
        mergeAndValidate({
          allOf: [
            {
              multipleOf: 4,
            },
            {
              multipleOf: 15,
            },
            {
              multipleOf: 3,
            },
          ],
        })
      ).toStrictEqual({
        multipleOf: 60,
      });

      expect(
        mergeAndValidate({
          allOf: [
            {
              multipleOf: 0.3,
            },
            {
              multipleOf: 0.7,
            },
            {
              multipleOf: 1,
            },
          ],
        })
      ).toStrictEqual({
        multipleOf: 21,
      });

      expect(
        mergeAndValidate({
          allOf: [
            {
              multipleOf: 0.5,
            },
            {
              multipleOf: 2,
            },
          ],
        })
      ).toStrictEqual({
        multipleOf: 2,
      });

      expect(
        mergeAndValidate({
          allOf: [
            {
              multipleOf: 0.3,
            },
            {
              multipleOf: 0.5,
            },
            {
              multipleOf: 1,
            },
          ],
        })
      ).toStrictEqual({
        multipleOf: 3,
      });

      expect(
        mergeAndValidate({
          allOf: [
            {
              multipleOf: 0.3,
            },
            {
              multipleOf: 0.7,
            },
            {
              multipleOf: 1,
            },
          ],
        })
      ).toStrictEqual({
        multipleOf: 21,
      });

      expect(
        mergeAndValidate({
          allOf: [
            {
              multipleOf: 0.4,
            },
            {
              multipleOf: 0.7,
            },
            {
              multipleOf: 3,
            },
          ],
        })
      ).toStrictEqual({
        multipleOf: 42,
      });

      expect(
        mergeAndValidate({
          allOf: [
            {
              multipleOf: 0.2,
            },
            {
              multipleOf: 0.65,
            },
            {
              multipleOf: 1,
            },
          ],
        })
      ).toStrictEqual({
        multipleOf: 13,
      });

      expect(
        mergeAndValidate({
          allOf: [
            {
              multipleOf: 100_000,
            },
            {
              multipleOf: 1_000_000,
            },
            {
              multipleOf: 500_000,
            },
          ],
        })
      ).toStrictEqual({
        multipleOf: 1_000_000,
      });
    });
  });

  describe('merging arrays', () => {
    it('merges required object', () => {
      expect(
        mergeAndValidate({
          required: ['prop2'],
          allOf: [
            {
              required: ['prop2', 'prop1'],
            },
          ],
        })
      ).toStrictEqual({
        required: ['prop1', 'prop2'],
      });
    });

    it('merges default value', () => {
      expect(
        mergeAndValidate({
          default: [
            'prop2',
            {
              prop1: 'foo',
            },
          ],
          allOf: [
            {
              default: ['prop2', 'prop1'],
            },
          ],
        })
      ).toStrictEqual({
        default: [
          'prop2',
          {
            prop1: 'foo',
          },
        ],
      });
    });

    it('merges default value', () => {
      expect(
        mergeAndValidate({
          default: {
            foo: 'bar',
          },
          allOf: [
            {
              default: ['prop2', 'prop1'],
            },
          ],
        })
      ).toStrictEqual({
        default: {
          foo: 'bar',
        },
      });
    });
  });

  describe('merging objects', () => {
    it('merges child objects', () => {
      expect(
        mergeAndValidate({
          properties: {
            name: {
              title: 'Name',
              type: 'string',
            },
          },
          allOf: [
            {
              properties: {
                name: {
                  title: 'allof1',
                  type: 'string',
                },
                added: {
                  type: 'integer',
                },
              },
            },
            {
              properties: {
                name: {
                  type: 'string',
                },
              },
            },
          ],
        })
      ).toStrictEqual({
        properties: {
          name: {
            title: 'Name',
            type: 'string',
          },
          added: {
            type: 'integer',
          },
        },
      });
    });

    it('merges boolean schemas', () => {
      expect(
        mergeAndValidate({
          properties: {
            name: true,
          },
          allOf: [
            {
              properties: {
                name: {
                  title: 'allof1',
                  type: 'string',
                },
                added: {
                  type: 'integer',
                },
              },
            },
            {
              properties: {
                name: {
                  type: 'string',
                  minLength: 5,
                },
              },
            },
          ],
        })
      ).toStrictEqual({
        properties: {
          name: {
            title: 'allof1',
            type: 'string',
            minLength: 5,
          },
          added: {
            type: 'integer',
          },
        },
      });

      expect(
        mergeAndValidate({
          properties: {
            name: false,
          },
          allOf: [
            {
              properties: {
                name: {
                  title: 'allof1',
                  type: 'string',
                },
                added: {
                  type: 'integer',
                },
              },
            },
            {
              properties: {
                name: true,
              },
            },
          ],
        })
      ).toStrictEqual({
        properties: {
          name: false,
          added: {
            type: 'integer',
          },
        },
      });

      expect(
        mergeAndValidate({
          allOf: [true, false],
        })
      ).toBe(false);

      expect(
        mergeAndValidate({
          properties: {
            name: true,
          },
          allOf: [
            {
              properties: {
                name: false,
                added: {
                  type: 'integer',
                },
              },
            },
            {
              properties: {
                name: true,
              },
            },
          ],
        })
      ).toStrictEqual({
        properties: {
          name: false,
          added: {
            type: 'integer',
          },
        },
      });
    });

    it('merges all allOf', () => {
      expect(
        mergeAndValidate({
          properties: {
            name: {
              allOf: [
                {
                  pattern: '^.+$',
                },
              ],
            },
          },
          allOf: [
            {
              properties: {
                name: true,
                added: {
                  type: 'integer',
                  title: 'pri1',
                  allOf: [
                    {
                      title: 'pri2',
                      type: ['string', 'integer'],
                      minimum: 15,
                      maximum: 10,
                    },
                  ],
                },
              },
              allOf: [
                {
                  properties: {
                    name: true,
                    added: {
                      type: 'integer',
                      minimum: 5,
                    },
                  },
                  allOf: [
                    {
                      properties: {
                        added: {
                          title: 'pri3',
                          type: 'integer',
                          minimum: 10,
                        },
                      },
                    },
                  ],
                },
              ],
            },
            {
              properties: {
                name: true,
                added: {
                  minimum: 7,
                },
              },
            },
          ],
        })
      ).toStrictEqual({
        properties: {
          name: {
            pattern: '^.+$',
          },
          added: {
            type: 'integer',
            title: 'pri1',
            minimum: 15,
            maximum: 10,
          },
        },
      });
    });
  });

  describe.skip('merging definitions', () => {
    it('merges circular', () => {
      const schema = {
        properties: {
          person: {
            properties: {
              name: {
                type: 'string' as const,
                minLength: 8,
              },
            },
            allOf: [
              {
                properties: {
                  name: {
                    minLength: 5,
                    maxLength: 10,
                  },
                },
                allOf: [
                  {
                    properties: {
                      prop1: {
                        minLength: 7,
                      },
                    },
                  },
                ],
              },
            ],
          },
        },
      };

      (schema.properties.person.properties as any).child = schema.properties.person;

      const expected = {
        person: {
          properties: {
            name: {
              minLength: 8,
              maxLength: 10,
              type: 'string',
            },
            prop1: {
              minLength: 7,
            },
          },
        } as JSONSchema7,
      };

      (expected.person.properties as any).child = expected.person;

      const result = mergeAndValidate(schema);

      expect(result).toStrictEqual({
        properties: expected,
      });
    });

    it.todo('merges any definitions and circular');
  });

  describe('dependencies', () => {
    it('merges similar schemas', () => {
      const result = mergeAndValidate({
        dependencies: {
          foo: {
            type: ['string', 'null', 'integer'],
            allOf: [
              {
                minimum: 5,
              },
            ],
          },
          bar: ['prop1', 'prop2'],
        },
        allOf: [
          {
            dependencies: {
              foo: {
                type: ['string', 'null'],
                allOf: [
                  {
                    minimum: 7,
                  },
                ],
              },
              bar: ['prop4'],
            },
          },
        ],
      });

      expect(result).toStrictEqual({
        dependencies: {
          foo: {
            type: ['string', 'null'],
            minimum: 7,
          },
          bar: ['prop1', 'prop2', 'prop4'],
        },
      });
    });

    it('merges mixed mode dependency', () => {
      const result = mergeAndValidate({
        dependencies: {
          bar: {
            type: ['string', 'null', 'integer'],
            required: ['abc'],
          },
        },
        allOf: [
          {
            dependencies: {
              bar: ['prop4'],
            },
          },
        ],
      });

      expect(result).toStrictEqual({
        dependencies: {
          bar: {
            type: ['string', 'null', 'integer'],
            required: ['abc', 'prop4'],
          },
        },
      });
    });
  });

  describe('propertyNames', () => {
    it('merges simliar schemas', () => {
      const result = mergeAndValidate({
        propertyNames: {
          type: 'string',
          allOf: [
            {
              minLength: 5,
            },
          ],
        },
        allOf: [
          {
            propertyNames: {
              type: 'string',
              pattern: 'abc.*',
              allOf: [
                {
                  maxLength: 7,
                },
              ],
            },
          },
        ],
      });

      expect(result).toStrictEqual({
        propertyNames: {
          type: 'string',
          pattern: 'abc.*',
          minLength: 5,
          maxLength: 7,
        },
      });
    });
  });
});
