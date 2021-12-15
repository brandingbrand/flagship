/* eslint-disable max-classes-per-file */

import { GlobalInjectorCache, Injectable, InjectionToken, Injector } from '../src';

describe('global cache', () => {
  beforeEach(() => {
    Injector.reset();
    GlobalInjectorCache.reset();
  });

  it('should maintain injected providers', () => {
    const token = new InjectionToken<number>('NUMBER_TOKEN');
    Injector.provide({ provide: token, useValue: 9 });

    const value = Injector.get(token);
    expect(value).toBe(9);
  });

  it('should share dependencies with new instances of GlobalInjectorCache', () => {
    const token1 = new InjectionToken<number>('NUMBER_TOKEN_1');
    const token2 = new InjectionToken<number>('NUMBER_TOKEN_2');

    Injector.provide({ provide: token1, useValue: 1 });
    GlobalInjectorCache.provide(token2, 2);

    const value1 = GlobalInjectorCache.get(token1);
    const value2 = Injector.get(token2);
    expect(value1).toBe(1);
    expect(value2).toBe(2);

    GlobalInjectorCache.remove(token1);
    Injector.remove(token2);

    const removedValue1 = Injector.get(token1);
    const removedValue2 = GlobalInjectorCache.get(token2);
    expect(removedValue1).toBe(undefined);
    expect(removedValue2).toBe(undefined);
  });

  it('should inject injectables automatically', () => {
    const token = new InjectionToken<Example>('CLASS_TOKEN');

    @Injectable(token)
    class Example {}

    const instance = Injector.get(token);
    expect(instance).toBeInstanceOf(Example);
  });

  it('should inject injectable classes without tokens', () => {
    @Injectable()
    class SomeService {}

    @Injectable()
    class SomeOtherService {
      constructor(public readonly service: SomeService) {}
    }

    const instance = Injector.get(SomeOtherService);
    expect(instance).toBeInstanceOf(SomeOtherService);
    expect(instance?.service).toBeInstanceOf(SomeService);
  });

  it('should provide undefined for removed tokens', () => {
    const token = new InjectionToken<number>('NUMBER_TOKEN');
    Injector.provide({ provide: token, useValue: 9 });
    Injector.remove(token);

    const value = Injector.get(token);
    expect(value).toBeUndefined();
  });

  it('should provide undefined if the reset after the token was provided', () => {
    const token = new InjectionToken<number>('NUMBER_TOKEN');
    Injector.provide({ provide: token, useValue: 9 });

    Injector.reset();

    const value = Injector.get(token);
    expect(value).toBeUndefined();
  });

  it('should throw if required dependency is missing', () => {
    const token = new InjectionToken<number>('NUMBER_TOKEN');

    expect(() => Injector.require(token)).toThrow(ReferenceError);
  });

  it('should throw in an duplicate token is provided', () => {
    const token = new InjectionToken<number>('NUMBER_TOKEN');
    Injector.provide({ provide: token, useValue: 9 });

    expect(() => Injector.provide({ provide: token, useValue: 9 })).toThrow(TypeError);
  });

  it('should throw in an invalid provider is provided', () => {
    const token = new InjectionToken<number>('NUMBER_TOKEN');

    // @ts-expect-error
    expect(() => Injector.provide({ provide: token })).toThrow(TypeError);

    // @ts-expect-error
    expect(() => Injector.provide({ useValue: 9 })).toThrow(TypeError);
  });
});
