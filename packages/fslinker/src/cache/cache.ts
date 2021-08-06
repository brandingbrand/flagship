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
    private readonly providers: Map<symbol, unknown>,
    private readonly fallback?: FallbackCache
  ) {}

  public get<T>(token: InjectionToken<T>): T | undefined {
    this.verifyToken(token);
    return (this.providers.get(token.key) as T) ?? this.fallback?.get(token);
  }

  public provide<T>(token: InjectionToken<T>, value: T): void {
    this.verifyToken(token);

    if (this.providers.has(token.key)) {
      throw new TypeError(
        `${
          InMemoryCache.name
        }: Duplicate provider, token ${token.key.toString()} is already provided`
      );
    }

    this.providers.set(token.key, value);
  }

  public remove(token: InjectionToken): void {
    this.verifyToken(token);
    this.providers.delete(token.key);
  }

  public reset(): void {
    this.providers.clear();
  }

  private verifyToken(token: InjectionToken): void {
    if (
      !token ||
      (typeof token !== 'object' && typeof token !== 'function') ||
      !('key' in token)
    ) {
      const actualType =
        token !== null && typeof token === 'object'
          ? (token as object).constructor.name
          : typeof token;
      throw new TypeError(`Expected token to be InjectionToken but got ${actualType} instead`);
    }
  }
}
