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
    const matches = inputSatisfies(alignChildrenSchema, alignChildrenSchema);

    expect(matches).toBe(true);
  });

  it('should match schemas that are partials of bigger schemas', () => {
    const matches = inputSatisfies(viewStyleSchema, alignChildrenSchema);

    expect(matches).toBe(true);
  });

  it('should not match with sub schemas', () => {
    const matches = inputSatisfies(liftedSchema, alignChildrenSchema);

    expect(matches).toBe(false);
  });

  it('should not match anything with an empty schema', () => {
    const matches = inputSatisfies({}, { type: 'boolean' });

    expect(matches).toBe(false);
  });

  it('should match a schema with an array of two objects of the same type', () => {
    const matches = inputSatisfies(refinementsSchema, refinementsEditorSchema);

    expect(matches).toBe(true);
  });

  it('should match commerce data source editor to props', () => {
    const matches = inputSatisfies(commerceDataSourceSchema, commerceDataSourceEditorSchema);

    expect(matches).toBe(true);
  });
});
