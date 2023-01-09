import type { FallbackCache, InjectorCache } from './cache';
import { GlobalInjectorCache } from './cache';
import type { InjectedClass } from './inject';
import { getDependencies } from './inject';
import { InjectionToken } from './providers';
import type {
  AnyInjectionToken,
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

  public static async requireAsync<T>(
    token: InjectedClass<T> | InjectionToken<T>
  ): Promise<T extends undefined ? never : T> {
    return this.injector.requireAsync(token);
  }

  public static provide<D extends unknown[], T, ManyType extends 'many' | 'single' = 'single'>(
    provider: Provider<D, T, ManyType>
  ): void {
    this.injector.provide(provider);
  }

  public static remove(token: AnyInjectionToken): void {
    this.injector.remove(token);
  }

  public static reset(): void {
    this.injector.reset();
  }

  public static keys(): IterableIterator<AnyInjectionToken> {
    return this.injector.keys();
  }

  constructor(private readonly cache: InjectorCache) {}

  private readonly providerCallbacks = new Map<AnyInjectionToken, Set<(value: unknown) => void>>();

  private verifyDeps(target: Function, deps: unknown[]): never | void {
    if (deps.length < target.length) {
      throw new ReferenceError(
        `${Injector.name}: ${target.name} requires ${target.length} dependencies but recieved ${deps.length} dependencies.
Check that your dependency array matches your factory or classes required dependencies.`
      );
    }
  }

  private async requireDepAsync<T>(depOrToken: InjectionToken<T> | T): Promise<T> {
    if (depOrToken instanceof InjectionToken) {
      return this.requireAsync(depOrToken);
    }

    return depOrToken;
  }

  private requireDep<T>(depOrToken: InjectionToken<T> | T): T {
    if (depOrToken instanceof InjectionToken) {
      return this.require(depOrToken);
    }

    return depOrToken;
  }

  private provideCache<T, ManyType extends 'many' | 'single' = 'single'>(
    token: InjectionToken<T, ManyType>,
    value: T,
    many?: boolean
  ): void {
    this.cache.provide(token, value, many);
    const callbacks = this.providerCallbacks.get(token);
    for (const callback of callbacks ?? []) {
      callback(value);
    }
  }

  private provideValue<T, ManyType extends 'many' | 'single' = 'single'>(
    provider: ValueProvider<T, ManyType>
  ): void {
    this.provideCache(provider.provide, provider.useValue, provider.many);
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
    const provideFactory = (deps: unknown[]): void => {
      this.verifyDeps(provider.useFactory, deps);

      const value = provider.useFactory(...(deps as Parameters<typeof provider['useFactory']>));
      this.provideCache(provider.provide, value, provider.many);
    };

    if (provider.async) {
      Promise.all(provider.deps.map(async (depOrToken) => this.requireDepAsync(depOrToken)))
        .then((deps) => {
          provideFactory(deps);
        })
        .catch(console.error);
    } else {
      const deps = provider.deps.map((depOrToken) => this.requireDep(depOrToken));
      provideFactory(deps);
    }
  }

  private provideStaticFactory<T, ManyType extends 'many' | 'single' = 'single'>(
    provider: BasicFactoryProvider<T, ManyType>
  ): void {
    const value = provider.useFactory();
    this.provideCache(provider.provide, value, provider.many);
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
  >(provider: InjectedClassProvider<D, T, ManyType>, tokensOnly?: boolean): void {
    const provideClass = (deps: unknown[]): void => {
      this.verifyDeps(provider.useClass, deps);

      const value = new provider.useClass(
        ...(deps as ConstructorParameters<typeof provider['useClass']>)
      );
      this.provideCache(provider.provide, value, provider.many);
    };

    if (provider.async) {
      Promise.all(
        provider.deps.map(async (depOrToken) =>
          tokensOnly === true
            ? this.requireAsync(depOrToken as InjectionToken)
            : this.requireDepAsync(depOrToken)
        )
      )
        .then((deps) => {
          provideClass(deps);
        })
        .catch(console.error);
    } else {
      const deps = provider.deps.map((depOrToken) =>
        tokensOnly === true
          ? this.require(depOrToken as InjectionToken)
          : this.requireDep(depOrToken)
      );
      provideClass(deps);
    }
  }

  private provideStaticClass<D extends unknown[], T, ManyType extends 'many' | 'single' = 'single'>(
    provider: BasicClassProvider<D, T, ManyType>
  ): void {
    const dependencyTokens = getDependencies(provider.useClass);
    this.provideClassWithDeps({ ...provider, deps: dependencyTokens }, true);
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

  public async requireAsync<T>(
    token: InjectedClass<T> | InjectionToken<T>
  ): Promise<T extends undefined ? never : T> {
    const dependency = this.get(token) as (T extends undefined ? never : T) | undefined;

    if (dependency !== undefined) {
      return dependency;
    }

    return new Promise((resolve) => {
      const callbacks = this.providerCallbacks.get(token as AnyInjectionToken) ?? new Set();
      this.providerCallbacks.set(token as AnyInjectionToken, callbacks);

      const callback = (value: unknown): void => {
        callbacks.delete(callback);
        resolve(value as T extends undefined ? never : T);
      };

      callbacks.add(callback);
    });
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

  public remove(token: AnyInjectionToken): void {
    this.cache.remove(token);
  }

  public reset(): void {
    this.cache.reset();
  }

  public keys(): IterableIterator<AnyInjectionToken> {
    return this.cache.keys();
  }
}
