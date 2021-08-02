import { InjectionToken, Provider } from './providers';
import { GlobalInjectorCache, InjectorCache } from './cache';
import { getDependencies } from './inject';

export class Injector {
  public static get<T>(token: InjectionToken<T>): T | undefined {
    return this.injector.get(token);
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

  public provide<D extends unknown[], T>(provider: Provider<D, T>): void {
    if ('useValue' in provider) {
      this.cache.provide(provider.provide, provider.useValue);
    }

    if ('useFactory' in provider) {
      if ('deps' in provider) {
        const deps = provider.deps.map(depOrToken => {
          if (depOrToken instanceof InjectionToken) {
            const dep = this.get(depOrToken);
            if (!dep) {
              throw new TypeError(
                // tslint:disable-next-line: ter-max-len
                `${Injector.name}: Token ${depOrToken.uniqueKey} could not be found but is required by ${provider.provide.uniqueKey}`
              );
            }

            return dep;
          }

          return depOrToken;
        }) as Parameters<typeof provider['useFactory']>;

        if (deps.length !== provider.useFactory.length) {
          // tslint:disable-next-line: ter-max-len
          throw new TypeError(`${Injector.name}: ${provider.useFactory.name} requires ${provider.useFactory.length} dependencies but recieved ${deps.length} dependencies`);
        }

        const value = provider.useFactory(...deps);
        this.cache.provide(provider.provide, value);
      } else {
        const value = provider.useFactory();
        this.cache.provide(provider.provide, value);
      }
    }

    if ('useClass' in provider) {
      if ('deps' in provider) {
        const deps = provider.deps.map(depOrToken => {
          if (depOrToken instanceof InjectionToken) {
            const dep = this.get(depOrToken);
            if (!dep) {
              throw new TypeError(
                // tslint:disable-next-line: ter-max-len
                `${Injector.name}: Token ${depOrToken.uniqueKey} could not be found but is required by ${provider.provide.uniqueKey}`
              );
            }

            return dep;
          }

          return depOrToken;
        }) as ConstructorParameters<typeof provider['useClass']>;

        if (deps.length !== provider.useClass.length) {
          // tslint:disable-next-line: ter-max-len
          throw new TypeError(`${Injector.name}: ${provider.useClass.name} requires ${provider.useClass.length} dependencies but recieved ${deps.length} dependencies`);
        }

        const value = new provider.useClass(...deps);
        this.cache.provide(provider.provide, value);
      } else {
        const deps = getDependencies(provider.useClass).map(token => {
          const dep = this.get(token);
          if (!dep) {
            throw new TypeError(
              // tslint:disable-next-line: ter-max-len
              `${Injector.name}: Token ${token.uniqueKey} could not be found but is required by ${provider.useClass.name}`
            );
          }

          return dep;
        }) as ConstructorParameters<typeof provider['useClass']>;

        if (deps.length !== provider.useClass.length) {
          // tslint:disable-next-line: ter-max-len
          throw new TypeError(`${Injector.name}: ${provider.useClass.name} requires ${provider.useClass.length} dependencies but recieved ${deps.length} dependencies`);
        }

        const value = new provider.useClass(...deps);
        this.cache.provide(provider.provide, value);
      }
    }
  }

  public reset(): void {
    this.cache.reset();
  }
}
