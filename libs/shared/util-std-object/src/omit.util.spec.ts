import { omit } from './omit.util';

describe('omit', () => {
  it('should omit key in object', () => {
    const options = omit({ a: 1, b: 2, c: 3 }, 'b');

    expect(options).toStrictEqual({ a: 1, c: 3 });
  });

  it('should return unchanged object', () => {
    const options = omit({ a: 1, b: 2, c: 3 }, 'd');

    expect(options).toStrictEqual({ a: 1, b: 2, c: 3 });
  });

  it('should omit symbol in object', () => {
    const symbolKey = Symbol('a');
    const options = omit({ [symbolKey]: 1, b: 2, c: 3 }, Symbol.for('a'));

    expect(options).toStrictEqual({ [symbolKey]: 1, b: 2, c: 3 });
  });
});
