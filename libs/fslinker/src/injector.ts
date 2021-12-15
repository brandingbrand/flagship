import {
  BasicClassProvider,
  BasicFactoryProvider,
  ClassProvider,
  FactoryProvider,
  InjectedClassProvider,
  InjectedFactoryProvider,
  InjectionToken,
  Provider,
  ValueProvider,
} from './providers';
import { FallbackCache, GlobalInjectorCache, InjectorCache } from './cache';
import { getDependencies, InjectedClass } from './inject';

export class Injector implements FallbackCache {
  public static get<T>(token: InjectionToken<T> | InjectedClass<T>): T | undefined {
    return this.injector.get(token);
  }

  public static require<T>(
    token: InjectionToken<T> | InjectedClass<T>
  ): T extends undefined ? never : T {
    return this.injector.require(token);
  }

  public static provide<D extends unknown[], T>(provider: Provider<D, T>): void {
    this.injector.provide(provider);
  }

  public static remove(token: InjectionToken): void {
    this.injector.remove(token);
  }

  public static reset(): void {
    this.injector.reset();
  }

  private static injector: Injector = new Injector(GlobalInjectorCache);

  constructor(private readonly cache: InjectorCache) {}

  public get<T>(token: InjectionToken<T> | InjectedClass<T>): T | undefined {
    return this.cache.get(token as InjectionToken<T>);
  }

  public require<T>(token: InjectionToken<T> | InjectedClass<T>): T extends undefined ? never : T {
    const dependency = this.get(token);
    if (dependency === undefined) {
      throw new ReferenceError(
        `${Injector.name}: Required ${(token as InjectionToken<T>).uniqueKey} is undefined.
If you are a developer seeing this message there can be a few causes:
- You are requiring a token that is never provided
- You are requiring a token that is not *yet* provided
- One of your dependencies is requiring a token that is not provided

In the event that your token is not provided, you will need to provide it via a
\`Injector.provide()\`
In the event that your token is not *yet* provided you will need to change your execution order.
This error is common when working with module side effects.
It may be necessary to use a factory to defer your dependency to after your token has been provided.
`
      );
    }

    return dependency as T extends undefined ? never : T;
  }

  public provide<D extends unknown[], T>(provider: Provider<D, T>): void {
    if (!('provide' in provider)) {
      throw new TypeError(
        `${Injector.name}: Expected provider to specify a provide token, but none was provided.
If you are a developer seeing this message then make sure that your parameter to
\`Injector.provide()\` is of the correct type.`
      );
    }

    if ('useValue' in provider) {
      this.provideValue(provider);
    } else if ('useFactory' in provider) {
      this.provideFactory(provider);
    } else if ('useClass' in provider) {
      this.provideClass(provider);
    } else {
      throw new TypeError(
        `${Injector.name}: Expected provider to provide either a value, factory or class, but none was provided.`
      );
    }
  }

  public remove(token: InjectionToken): void {
    this.cache.remove(token);
  }

  public reset(): void {
    this.cache.reset();
  }

  private verifyDeps(target: Function, deps: unknown[]): void | never {
    if (deps.length !== target.length) {
      throw new ReferenceError(
        `${Injector.name}: ${target.name} requires ${target.length} dependencies but recieved ${deps.length} dependencies.
Check that your dependency array matches your factory or classes required dependencies.`
      );
    }
  }

  private requireDep<T>(depOrToken: T | InjectionToken<T>): T {
    if (depOrToken instanceof InjectionToken) {
      return this.require(depOrToken);
    }

    return depOrToken;
  }

  private provideValue<T>(provider: ValueProvider<T>): void {
    this.cache.provide(provider.provide, provider.useValue);
  }

  private provideFactory<D extends unknown[], T>(provider: FactoryProvider<D, T>): void {
    if ('deps' in provider) {
      this.provideFactoryWithDeps(provider);
    } else {
      this.provideStaticFactory(provider);
    }
  }

  private provideFactoryWithDeps<D extends unknown[], T>(
    provider: InjectedFactoryProvider<D, T>
  ): void {
    const deps = provider.deps.map((depOrToken) => this.requireDep(depOrToken));
    this.verifyDeps(provider.useFactory, deps);

    const value = provider.useFactory(...(deps as Parameters<typeof provider['useFactory']>));
    this.cache.provide(provider.provide, value);
  }

  private provideStaticFactory<T>(provider: BasicFactoryProvider<T>): void {
    const value = provider.useFactory();
    this.cache.provide(provider.provide, value);
  }

  private provideClass<D extends unknown[], T>(provider: ClassProvider<D, T>): void {
    if ('deps' in provider) {
      this.provideClassWithDeps(provider);
    } else {
      this.provideStaticClass(provider);
    }
  }

  private provideClassWithDeps<D extends unknown[], T>(
    provider: InjectedClassProvider<D, T>
  ): void {
    const deps = provider.deps.map((depOrToken) => this.requireDep(depOrToken));
    this.verifyDeps(provider.useClass, deps);

    const value = new provider.useClass(
      ...(deps as ConstructorParameters<typeof provider['useClass']>)
    );
    this.cache.provide(provider.provide, value);
  }

  private provideStaticClass<D extends unknown[], T>(provider: BasicClassProvider<D, T>): void {
    const deps = getDependencies(provider.useClass).map((token) => this.require(token));
    this.verifyDeps(provider.useClass, deps);

    const value = new provider.useClass(
      ...(deps as ConstructorParameters<typeof provider['useClass']>)
    );
    this.cache.provide(provider.provide, value);
  }
}
