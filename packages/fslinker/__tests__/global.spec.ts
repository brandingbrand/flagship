import { InjectionToken, Injector } from '../src';

describe('global cache', () => {
  beforeEach(() => {
    Injector.reset();
  });

  it('should maintain injected providers', () => {
    const token = new InjectionToken<number>('some_token');
    Injector.provide({ provide: token, useValue: 9 });

    const value = Injector.get(token);
    expect(value).toBe(9);
  });

  it('should throw in an invalid provider is provided', () => {
    const token = new InjectionToken<number>('some_token');

    // @ts-expect-error
    expect(() => Injector.provide({ provide: token })).toThrow(TypeError);

    // @ts-expect-error
    expect(() => Injector.provide({ useValue: 9 })).toThrow(TypeError);
  });
});
