import { InjectionToken } from '../providers';

export interface InjectorCache {
  get<T>(token: InjectionToken<T>): T | undefined;
  has(token: InjectionToken): boolean;
  provide<T>(token: InjectionToken<T>, value: T): void;
  remove(token: InjectionToken): void;
  reset(): void;
}

export interface FallbackCache {
  get<T>(token: InjectionToken<T>): T | undefined;
  has(token: InjectionToken): boolean;
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

  public has<T>(token: InjectionToken<T>): boolean {
    this.verifyToken(token);
    return (this.providers.has(token.key) || this.fallback?.has(token)) ?? false;
  }

  public provide<T>(token: InjectionToken<T>, value: T): void {
    this.verifyToken(token);

    if (this.providers.has(token.key)) {
      throw new TypeError(
        // tslint:disable-next-line: ter-max-len
        `${InMemoryCache.name}: Duplicate provider, token ${token.key.toString()} is already provided.
If you are a developer seeing this message there can be a few causes:
- You have explicitly reused the same token when providing dependencies
- You have given two tokens the same name
- You have a versioning issue resulting a side effect unexpectedly running more than once

Check your tokens to make sure that the keys are unique.
Check your dependencies version lock to make sure that those with side effects do not have
more than a single version`
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
