import { consumeSchema } from './index';
import { alignChildrenSchema, viewStyleSchema } from '../../fixtures';
import { cloneDeep } from '@brandingbrand/standard-object';

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
});
