import { without } from './without.util';

describe('without', () => {
  it('should', () => {
    const difference = without([2, 1, 2, 3], 1, 2);

    expect(difference).toStrictEqual([3]);
  });
});
