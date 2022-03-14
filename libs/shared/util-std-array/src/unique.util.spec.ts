import { unique } from './unique.util';

describe('unique', () => {
  it('should return unique values', () => {
    const uniqueObjects = unique([2, 1, 2]);

    expect(uniqueObjects).toStrictEqual([2, 1]);
  });
});
