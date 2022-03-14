import { uniqueWith } from './unique-with.util';

describe('uniqueWith', () => {
  it('should return unique values', () => {
    const isEqual = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
    const objects = [
      { x: 1, y: 2 },
      { x: 2, y: 1 },
      { x: 1, y: 2 },
    ];

    const uniqueObjects = uniqueWith(objects, isEqual);

    expect(uniqueObjects).toStrictEqual([
      { x: 1, y: 2 },
      { x: 2, y: 1 },
    ]);
  });
});
