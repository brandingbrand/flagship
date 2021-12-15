import { InjectionToken, Injector, LocalInjectorCache } from '../src';

describe('injected factory', () => {
  let injector: Injector;

  beforeEach(() => {
    injector = new Injector(new LocalInjectorCache());
  });

  it('should not throw an error when injecting a factory', () => {
    const token = new InjectionToken<number>('NUMBER_TOKEN');
    expect(() => injector.provide({ provide: token, useFactory: () => 9 })).not.toThrow();
  });

  it('should provide the returned value of the factory', () => {
    const token = new InjectionToken<number>('NUMBER_TOKEN');
    injector.provide({ provide: token, useFactory: () => 10 + 20 });

    const value = injector.get(token);
    expect(value).toBe(30);
  });

  it('should inject dependencies', () => {
    const dependencyToken = new InjectionToken<number>('DEPENDENCY_TOKEN');
    const token = new InjectionToken<number>('NUMBER_TOKEN');

    injector.provide({
      provide: dependencyToken,
      useValue: 20,
    });
    injector.provide({
      provide: token,
      useFactory: (dependency) => dependency * 10,
      deps: [dependencyToken],
    });

    const value = injector.get(token);
    expect(value).toBe(200);
  });

  it('should provide values that are not injection tokens', () => {
    const token = new InjectionToken<number>('NUMBER_TOKEN');

    injector.provide({
      provide: token,
      useFactory: (dependency) => dependency * 10,
      deps: [30],
    });

    const value = injector.get(token);
    expect(value).toBe(300);
  });

  it('should throw if the incorrect number of dependencies is provided', () => {
    const token = new InjectionToken<number>('NUMBER_TOKEN');

    expect(() =>
      injector.provide({
        provide: token,
        useFactory: (dependency: number) => dependency * 10,
        // @ts-expect-error
        deps: [],
      })
    ).toThrow(ReferenceError);
  });

  it('should throw if a dependency is not provided', () => {
    const dependencyToken = new InjectionToken<number>('DEPENDENCY_TOKEN');
    const token = new InjectionToken<number>('NUMBER_TOKEN');

    expect(() =>
      injector.provide({
        provide: token,
        useFactory: (dependency) => dependency * 10,
        deps: [dependencyToken],
      })
    ).toThrow(ReferenceError);
  });
});
