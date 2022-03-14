import { intersection } from './intersection.util';

describe('intersection', () => {
  it('should return values that are common between all arrays', () => {
    const common = intersection([2, 1], [2, 3]);

    expect(common).toStrictEqual([2]);
  });
});
