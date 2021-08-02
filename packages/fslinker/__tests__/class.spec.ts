// tslint:disable: max-classes-per-file
import { Inject, Injectable, InjectionToken, Injector, LocalInjectorCache } from '../src';

describe('injected class', () => {
  let injector: Injector;

  beforeEach(() => {
    injector = new Injector(new LocalInjectorCache());
  });

  it('should not throw an error when injecting a class', () => {
    class Example {}
    const token = new InjectionToken<Example>('CLASS_TOKEN');

    expect(() => injector.provide({ provide: token, useClass: Example })).not.toThrow();
  });

  it('should provide an instance of an injected class', () => {
    class Example {}
    const token = new InjectionToken<Example>('CLASS_TOKEN');

    injector.provide({ provide: token, useClass: Example });

    const instance = injector.get(token);
    expect(instance).toBeInstanceOf(Example);
  });

  it('should inject defined deps', () => {
    class Dependency {}
    class Example {
      constructor(public readonly dep: Dependency) {}
    }

    const dependencyToken = new InjectionToken<Dependency>('DEPENDENCY_TOKEN');
    const token = new InjectionToken<Example>('CLASS_TOKEN');

    injector.provide({ provide: dependencyToken, useClass: Dependency });
    injector.provide({ provide: token, useClass: Example, deps: [dependencyToken] });

    const instance = injector.get(token);
    expect(instance?.dep).toBeInstanceOf(Dependency);
  });

  it('should throw if an incorrect number of dependencies is provided', () => {
    class Dependency {}
    class Example {
      constructor(public readonly dep: Dependency) {}
    }

    const dependencyToken = new InjectionToken<Dependency>('DEPENDENCY_TOKEN');
    const token = new InjectionToken<Example>('CLASS_TOKEN');

    injector.provide({ provide: dependencyToken, useClass: Dependency });
    expect(() =>
      injector.provide({
        provide: token,
        useClass: Example,
        // @ts-expect-error
        deps: [dependencyToken, dependencyToken]
      })
    ).toThrow(TypeError);
  });

  it('should throw if a dependency is missing', () => {
    class Dependency {}
    class Example {
      constructor(public readonly dep: Dependency) {}
    }

    const dependencyToken = new InjectionToken<Dependency>('DEPENDENCY_TOKEN');
    const token = new InjectionToken<Example>('CLASS_TOKEN');

    expect(() =>
      injector.provide({
        provide: token,
        useClass: Example,
        deps: [dependencyToken]
      })
    ).toThrow(TypeError);
  });

  it('should automatically apply decorated dependencies', () => {
    const dependencyToken = new InjectionToken<Dependency>('DEPENDENCY_TOKEN');
    const token = new InjectionToken<Example>('CLASS_TOKEN');

    class Dependency {}
    class Example {
      constructor(@Inject(dependencyToken) public readonly dep: Dependency) {}
    }

    injector.provide({ provide: dependencyToken, useClass: Dependency });
    injector.provide({ provide: token, useClass: Example });

    const instance = injector.get(token);
    expect(instance?.dep).toBeInstanceOf(Dependency);
  });

  it('should automatically provide injectable classes', () => {
    const token = new InjectionToken<Example>('CLASS_TOKEN');

    @Injectable(token, injector)
    class Example {}

    const instance = injector.get(token);
    expect(instance).toBeInstanceOf(Example);
  });
});
