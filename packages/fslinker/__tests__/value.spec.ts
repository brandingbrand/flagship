import { InjectionToken, Injector, LocalInjectorCache } from '../src';

describe('injected value', () => {
  let injector: Injector;

  beforeEach(() => {
    injector = new Injector(new LocalInjectorCache());
  });

  it('should not throw an error when injecting a value', () => {
    const token = new InjectionToken<number>('NUMBER_TOKEN');
    expect(() => injector.provide({ provide: token, useValue: 9 })).not.toThrow();
  });

  it('should return the provided value', () => {
    const token = new InjectionToken<number>('NUMBER_TOKEN');
    injector.provide({ provide: token, useValue: 9 });

    const value = injector.get(token);
    expect(value).toBe(9);
  });

  it('should throw when providing a duplicate token', () => {
    const token = new InjectionToken<number>('NUMBER_TOKEN');
    injector.provide({ provide: token, useValue: 9 });

    expect(() => injector.provide({ provide: token, useValue: 9 })).toThrowError(/duplicate/i);
  });

  it('should maintain references', () => {
    const token = new InjectionToken<never[]>('ARRAY_TOKEN');
    const array: never[] = [];
    injector.provide({ provide: token, useValue: array });

    const value = injector.get(token);
    expect(value).toBe(array);
  });

  it('should maintain references for duplicated tokens', () => {
    const originalToken = new InjectionToken<never[]>('ARRAY_TOKEN');
    const array: never[] = [];
    injector.provide({ provide: originalToken, useValue: array });

    const duplicateToken = new InjectionToken<number>('ARRAY_TOKEN');
    const value = injector.get(duplicateToken);

    expect(value).toBe(array);
  });

  it('should return undefined for unprovided values', () => {
    const token = new InjectionToken<number>('NUMBER_TOKEN');
    const value = injector.get(token);

    expect(value).toBeUndefined();
  });
});
