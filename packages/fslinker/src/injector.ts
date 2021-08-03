import {
  BasicClassProvider,
  BasicFactoryProvider,
  ClassProvider,
  FactoryProvider,
  InjectedClassProvider,
  InjectedFactoryProvider,
  InjectionToken,
  Provider,
  ValueProvider
} from './providers';
import { GlobalInjectorCache, InjectorCache } from './cache';
import { getDependencies } from './inject';

export class Injector {
  public static get<T>(token: InjectionToken<T>): T | undefined {
    return this.injector.get(token);
  }

  public static require<T>(token: InjectionToken<T>): T extends undefined ? never : T {
    return this.injector.require(token);
  }

  public static provide<D extends unknown[], T>(provider: Provider<D, T>): void {
    this.injector.provide(provider);
  }

  public static reset(): void {
    this.injector.reset();
  }

  private static injector: Injector = new Injector(new GlobalInjectorCache());

  constructor(private readonly cache: InjectorCache) {}

  public get<T>(token: InjectionToken<T>): T | undefined {
    return this.cache.get(token);
  }

  public require<T>(token: InjectionToken<T>): T extends undefined ? never : T {
    const dependency = this.cache.get(token);
    if (dependency === undefined) {
      throw new TypeError(`${Injector.name}: Required ${token.uniqueKey} is undefined`);
    }

    return dependency as T extends undefined ? never : T;
  }

  public provide<D extends unknown[], T>(provider: Provider<D, T>): void {
    if (!('provide' in provider)) {
      throw new TypeError(
        // tslint:disable-next-line: ter-max-len
        `${Injector.name}: Expected provider to specify a provide token, but none was provided`
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
        // tslint:disable-next-line: ter-max-len
        `${Injector.name}: Expected provider to provide either a value, factory or class, but none was provided`
      );
    }
  }

  public reset(): void {
    this.cache.reset();
  }

  private verifyDeps(target: Function, deps: unknown[]): void | never {
    if (deps.length !== target.length) {
      throw new TypeError(
        // tslint:disable-next-line: ter-max-len
        `${Injector.name}: ${target.name} requires ${target.length} dependencies but recieved ${deps.length} dependencies`
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
    const deps = provider.deps.map(depOrToken => this.requireDep(depOrToken));
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
    const deps = provider.deps.map(depOrToken => this.requireDep(depOrToken));
    this.verifyDeps(provider.useClass, deps);

    const value = new provider.useClass(
      ...(deps as ConstructorParameters<typeof provider['useClass']>)
    );
    this.cache.provide(provider.provide, value);
  }

  private provideStaticClass<D extends unknown[], T>(provider: BasicClassProvider<D, T>): void {
    const deps = getDependencies(provider.useClass).map(token => this.require(token));
    this.verifyDeps(provider.useClass, deps);

    const value = new provider.useClass(
      ...(deps as ConstructorParameters<typeof provider['useClass']>)
    );
    this.cache.provide(provider.provide, value);
  }
}
