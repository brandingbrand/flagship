// tslint:disable: max-classes-per-file
import {
  getDependencies,
  Inject,
  Injectable,
  InjectionToken,
  Injector,
  LocalInjectorCache
} from '../src';

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
    ).toThrow(ReferenceError);
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
    ).toThrow(ReferenceError);
  });

  it('should automatically apply decorated dependencies', () => {
    const dependencyToken1 = new InjectionToken<Dependency1>('DEPENDENCY_TOKEN_1');
    const dependencyToken2 = new InjectionToken<Dependency2>('DEPENDENCY_TOKEN_2');
    const token = new InjectionToken<Example>('CLASS_TOKEN');

    class Dependency1 {}
    class Dependency2 {}
    class Example {
      constructor(
        @Inject(dependencyToken1) public readonly dep1: Dependency1,
        @Inject(dependencyToken2) public readonly dep2: Dependency2
      ) {}
    }

    injector.provide({ provide: dependencyToken1, useClass: Dependency1 });
    injector.provide({ provide: dependencyToken2, useClass: Dependency2 });
    injector.provide({ provide: token, useClass: Example });

    const instance = injector.get(token);
    expect(instance?.dep1).toBeInstanceOf(Dependency1);
    expect(instance?.dep2).toBeInstanceOf(Dependency2);
  });

  it('should automatically provide injectable classes', () => {
    const token = new InjectionToken<Example>('CLASS_TOKEN');

    @Injectable(token, injector)
    class Example {}

    const instance = injector.get(token);
    expect(instance).toBeInstanceOf(Example);
  });

  it('should report dependencies with getDependencies()', () => {
    const dependencyToken1 = new InjectionToken<Dependency1>('DEPENDENCY_TOKEN_1');
    const dependencyToken2 = new InjectionToken<Dependency2>('DEPENDENCY_TOKEN_2');

    class Dependency1 {}
    class Dependency2 {}
    class Example {
      constructor(
        @Inject(dependencyToken1) public readonly dep1: Dependency1,
        @Inject(dependencyToken2) public readonly dep2: Dependency2
      ) {}
    }

    const deps = getDependencies(Example);
    expect(deps).toHaveLength(2);
    expect(deps[0]).toBe(dependencyToken1);
    expect(deps[1]).toBe(dependencyToken2);
  });
});
