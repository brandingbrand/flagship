import type { JSONSchema7 } from 'json-schema';

import { cloneDeep } from '@brandingbrand/standard-object';

import { consumeSchema } from './index';
import { alignChildrenSchema, liftedSchema, viewStyleSchema } from '../../fixtures';

describe('consumeSchema', () => {
  it('should maintain object type if not all properties are consumed', () => {
    const duplicatedViewSchema = cloneDeep(viewStyleSchema);

    consumeSchema(duplicatedViewSchema, alignChildrenSchema);
    expect(duplicatedViewSchema).toStrictEqual(expect.objectContaining({ type: 'object' }));
  });

  it('should empty the schema if all properties are consumed', () => {
    const duplicatedAlignChildrenSchema = cloneDeep(alignChildrenSchema);

    consumeSchema(duplicatedAlignChildrenSchema, alignChildrenSchema);
    expect(duplicatedAlignChildrenSchema).toStrictEqual({});
  });

  it('should only consume the properties that are matching', () => {
    const duplicatedViewSchema = cloneDeep(viewStyleSchema);

    consumeSchema(duplicatedViewSchema, alignChildrenSchema);
    expect(duplicatedViewSchema).toStrictEqual(
      expect.objectContaining({
        properties: expect.objectContaining({
          backgroundColor: expect.objectContaining({}),
        }),
      })
    );
  });

  it('should return an empty object if all properties are consumed', () => {
    const duplicatedLiftedSchema = cloneDeep(liftedSchema);

    consumeSchema(duplicatedLiftedSchema, duplicatedLiftedSchema);
    expect(duplicatedLiftedSchema).toStrictEqual({});
  });

  it('should remove types', () => {
    const schema: JSONSchema7 = {
      enum: ['hidden', 'visible'],
      type: 'string',
      title: 'backfaceVisibility',
    };
    consumeSchema(schema, { type: 'string', enum: [] });

    expect(schema).toStrictEqual({});
  });
});
