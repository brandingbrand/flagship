import { inputSatisfies } from './index';
import { alignChildrenSchema, liftedSchema, viewStyleSchema } from '../../fixtures';

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
});
