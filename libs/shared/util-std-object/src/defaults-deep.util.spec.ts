import { defaultsDeep } from './defaults-deep.util';

describe('defaultsDeep', () => {
  it('should set defaults', () => {
    const options = defaultsDeep({ a: 1 }, { b: 2 }, { a: 3 });

    expect(options).toStrictEqual({ a: 1, b: 2 });
  });

  it('should set defaults deeply', () => {
    const options = defaultsDeep({ a: { b: 2 } }, { a: { b: 1, c: 3 } });

    expect(options).toStrictEqual({ a: { b: 2, c: 3 } });
  });
});
