import {
  alignChildrenSchema,
  commerceDataSourceEditorSchema,
  commerceDataSourceSchema,
  liftedSchema,
  refinementsEditorSchema,
  refinementsSchema,
  viewStyleSchema,
} from '../../fixtures';

import { inputSatisfies } from '.';

describe('isSuperSet', () => {
  it('should match schemas that are the same', () => {
    const doesMatch = inputSatisfies(alignChildrenSchema, alignChildrenSchema);

    expect(doesMatch).toBe(true);
  });

  it('should match schemas that are partials of bigger schemas', () => {
    const doesMatch = inputSatisfies(viewStyleSchema, alignChildrenSchema);

    expect(doesMatch).toBe(true);
  });

  it('should not match with sub schemas', () => {
    const doesMatch = inputSatisfies(liftedSchema, alignChildrenSchema);

    expect(doesMatch).toBe(false);
  });

  it('should not match anything with an empty schema', () => {
    const doesMatch = inputSatisfies({}, { type: 'boolean' });

    expect(doesMatch).toBe(false);
  });

  it('should match a schema with an array of two objects of the same type', () => {
    const doesMatch = inputSatisfies(refinementsSchema, refinementsEditorSchema);

    expect(doesMatch).toBe(true);
  });

  it('should match commerce data source editor to props', () => {
    const doesMatch = inputSatisfies(commerceDataSourceSchema, commerceDataSourceEditorSchema);

    expect(doesMatch).toBe(true);
  });
});
