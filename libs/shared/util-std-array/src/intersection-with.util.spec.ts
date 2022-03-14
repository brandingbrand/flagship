import { intersectionWith } from './intersection-with.util';

describe('intersectionWith', () => {
  it('should return values that are common between all arrays', () => {
    const isEqual = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
    const objects = [
      { x: 1, y: 2 },
      { x: 2, y: 1 },
    ];
    const others = [
      { x: 1, y: 1 },
      { x: 1, y: 2 },
    ];

    const common = intersectionWith(isEqual, objects, others);

    expect(common).toStrictEqual([{ x: 1, y: 2 }]);
  });
});
