import type { FallbackCache, InjectorCache } from './cache';
import { GlobalInjectorCache } from './cache';
import type { InjectedClass } from './inject';
import { getDependencies } from './inject';
import { InjectionToken } from './providers';
import type {
  BasicClassProvider,
  BasicFactoryProvider,
  ClassProvider,
  FactoryProvider,
  InjectedClassProvider,
  InjectedFactoryProvider,
  Provider,
  ValueProvider,
} from './providers';

export class Injector implements FallbackCache {
  private static readonly injector: Injector = new Injector(GlobalInjectorCache);

  public static get<T>(token: InjectedClass<T> | InjectionToken<T>): T | undefined {
    return this.injector.get(token);
  }

  public static getMany<T>(token: InjectedClass<T> | InjectionToken<T, 'many'>): T[] {
    return this.injector.getMany(token);
  }

  public static has(token: InjectedClass | InjectionToken): boolean {
    return this.injector.has(token);
  }

  public static require<T>(
    token: InjectedClass<T> | InjectionToken<T>
  ): T extends undefined ? never : T {
    return this.injector.require(token);
  }

  public static provide<D extends unknown[], T, ManyType extends 'many' | 'single' = 'single'>(
    provider: Provider<D, T, ManyType>
  ): void {
    this.injector.provide(provider);
  }

  public static remove(token: InjectionToken): void {
    this.injector.remove(token);
  }

  public static reset(): void {
    this.injector.reset();
  }

  constructor(private readonly cache: InjectorCache) {}

  private verifyDeps(target: Function, deps: unknown[]): never | void {
    if (deps.length !== target.length) {
      throw new ReferenceError(
        `${Injector.name}: ${target.name} requires ${target.length} dependencies but recieved ${deps.length} dependencies.
Check that your dependency array matches your factory or classes required dependencies.`
      );
    }
  }

  private requireDep<T>(depOrToken: InjectionToken<T> | T): T {
    if (depOrToken instanceof InjectionToken) {
      return this.require(depOrToken);
    }

    return depOrToken;
  }

  private provideValue<T, ManyType extends 'many' | 'single' = 'single'>(
    provider: ValueProvider<T, ManyType>
  ): void {
    this.cache.provide(provider.provide, provider.useValue, provider.many);
  }

  private provideFactory<D extends unknown[], T, ManyType extends 'many' | 'single' = 'single'>(
    provider: FactoryProvider<D, T, ManyType>
  ): void {
    if ('deps' in provider) {
      this.provideFactoryWithDeps(provider);
    } else {
      this.provideStaticFactory(provider);
    }
  }

  private provideFactoryWithDeps<
    D extends unknown[],
    T,
    ManyType extends 'many' | 'single' = 'single'
  >(provider: InjectedFactoryProvider<D, T, ManyType>): void {
    const deps = provider.deps.map((depOrToken) => this.requireDep(depOrToken));
    this.verifyDeps(provider.useFactory, deps);

    const value = provider.useFactory(...(deps as Parameters<typeof provider['useFactory']>));
    this.cache.provide(provider.provide, value, provider.many);
  }

  private provideStaticFactory<T, ManyType extends 'many' | 'single' = 'single'>(
    provider: BasicFactoryProvider<T, ManyType>
  ): void {
    const value = provider.useFactory();
    this.cache.provide(provider.provide, value, provider.many);
  }

  private provideClass<D extends unknown[], T, ManyType extends 'many' | 'single' = 'single'>(
    provider: ClassProvider<D, T, ManyType>
  ): void {
    if ('deps' in provider) {
      this.provideClassWithDeps(provider);
    } else {
      this.provideStaticClass(provider);
    }
  }

  private provideClassWithDeps<
    D extends unknown[],
    T,
    ManyType extends 'many' | 'single' = 'single'
  >(provider: InjectedClassProvider<D, T, ManyType>): void {
    const deps = provider.deps.map((depOrToken) => this.requireDep(depOrToken));
    this.verifyDeps(provider.useClass, deps);

    const value = new provider.useClass(
      ...(deps as ConstructorParameters<typeof provider['useClass']>)
    );
    this.cache.provide(provider.provide, value, provider.many);
  }

  private provideStaticClass<D extends unknown[], T, ManyType extends 'many' | 'single' = 'single'>(
    provider: BasicClassProvider<D, T, ManyType>
  ): void {
    const deps = getDependencies(provider.useClass).map((token) => this.require(token));
    this.verifyDeps(provider.useClass, deps);

    const value = new provider.useClass(
      ...(deps as ConstructorParameters<typeof provider['useClass']>)
    );
    this.cache.provide(provider.provide, value, provider.many);
  }

  public get<T>(token: InjectedClass<T> | InjectionToken<T>): T | undefined {
    return this.cache.get(token as InjectionToken<T>);
  }

  public getMany<T>(token: InjectedClass<T> | InjectionToken<T, 'many'>): T[] {
    return this.cache.getMany(token as InjectionToken<T, 'many'>);
  }

  public has(token: InjectedClass | InjectionToken): boolean {
    return this.cache.has(token as InjectionToken);
  }

  public require<T>(token: InjectedClass<T> | InjectionToken<T>): T extends undefined ? never : T {
    const dependency = this.get(token);
    if (dependency === undefined) {
      throw new ReferenceError(
        `${Injector.name}: Required ${(
          token as InjectionToken<T>
        ).uniqueKey.toString()} is undefined.
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

  public provide<D extends unknown[], T, ManyType extends 'many' | 'single' = 'single'>(
    provider: Provider<D, T, ManyType>
  ): void {
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
}
