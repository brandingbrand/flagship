import { difference } from './difference.util';

describe('difference', () => {
  it('should return the items that and unique to each array', () => {
    const array1 = [0, 1, 2, 3];
    const array2 = [1, 2, 3, 4];

    expect(difference(array1, array2)).toStrictEqual([0, 4]);
  });
});
