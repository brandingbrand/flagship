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
});
