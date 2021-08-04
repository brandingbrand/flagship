import { InjectionToken } from '../providers';

export interface InjectorCache {
  get<T>(token: InjectionToken<T>): T | undefined;
  provide<T>(token: InjectionToken<T>, value: T): void;
  remove(token: InjectionToken): void;
  reset(): void;
}

export interface FallbackCache {
  get<T>(token: InjectionToken<T>): T | undefined;
}

export class InMemoryCache {
  constructor(
    private readonly providers: Map<string, unknown>,
    private readonly fallback?: FallbackCache
  ) {}

  public get<T>(token: InjectionToken<T>): T | undefined {
    return (this.providers.get(token.uniqueKey) as T) ?? this.fallback?.get(token);
  }

  public provide<T>(token: InjectionToken<T>, value: T): void {
    if (this.providers.has(token.uniqueKey)) {
      throw new TypeError(
        `${InMemoryCache.name}: Duplicate provider, token ${token.uniqueKey} is already provided`
      );
    }

    this.providers.set(token.uniqueKey, value);
  }

  public remove(token: InjectionToken): void {
    this.providers.delete(token.uniqueKey);
  }

  public reset(): void {
    this.providers.clear();
  }
}
