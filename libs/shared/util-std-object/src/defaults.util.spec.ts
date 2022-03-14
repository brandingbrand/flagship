import { defaults } from './defaults.util';

describe('defaults', () => {
  it('should set defaults', () => {
    const options = defaults({ a: 1 }, { b: 2 }, { a: 3 });

    expect(options).toStrictEqual({ a: 1, b: 2 });
  });

  it('should not set defaults deeply', () => {
    const options = defaults({ a: { b: 2 } }, { a: { b: 1, c: 3 } });

    expect(options).not.toStrictEqual({ a: { b: 2, c: 3 } });
  });
});
