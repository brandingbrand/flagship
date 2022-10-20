import type { AnyInjectionToken } from '../providers';
import { InjectionToken } from '../providers';

export interface InjectorCache {
  get: <T>(token: InjectionToken<T>) => T | undefined;
  getMany: <T>(token: InjectionToken<T, 'many'>) => T[];
  has: (token: InjectionToken) => boolean;
  provide: <T>(token: InjectionToken<T, 'many' | 'single'>, value: T, many?: boolean) => void;
  remove: (token: AnyInjectionToken) => void;
  reset: () => void;
  keys: () => IterableIterator<AnyInjectionToken>;
}

export interface FallbackCache {
  get: <T>(token: InjectionToken<T>) => T | undefined;
  getMany: <T>(token: InjectionToken<T, 'many'>) => T[];
  has: (token: InjectionToken) => boolean;
}

export class InMemoryCache {
  constructor(
    private readonly providers: Map<string | symbol, unknown>,
    private readonly fallback?: FallbackCache
  ) {}

  private readonly tokens = new Map<string | symbol, AnyInjectionToken>();

  private verifyToken(token: AnyInjectionToken): void {
    if (
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions -- Type Guard
      !token ||
      (typeof token !== 'object' && typeof token !== 'function') ||
      !('uniqueKey' in token)
    ) {
      const actualType =
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- Type Guard
        token !== null && typeof token === 'object'
          ? (token as object).constructor.name
          : typeof token;
      throw new TypeError(`Expected token to be InjectionToken but got ${actualType} instead`);
    }
  }

  public get<T>(token: InjectionToken<T>): T | undefined {
    this.verifyToken(token);
    return (this.providers.get(token.uniqueKey) as T | undefined) ?? this.fallback?.get(token);
  }

  public getMany<T>(token: InjectionToken<T, 'many'>): T[] {
    this.verifyToken(token);
    const provider = this.providers.get(token.uniqueKey) as T | T[] | undefined;

    if (provider === undefined) {
      return this.fallback?.getMany(token) ?? [];
    }

    return Array.isArray(provider) ? provider : [provider];
  }

  public has(token: InjectionToken): boolean {
    this.verifyToken(token);
    return this.providers.has(token.uniqueKey) || Boolean(this.fallback?.has(token));
  }

  public provide<T>(token: InjectionToken<T, 'many' | 'single'>, value: T, many?: boolean): void {
    this.verifyToken(token);

    if (this.providers.has(token.uniqueKey) && many !== true) {
      throw new TypeError(
        `${
          InMemoryCache.name
        }: Duplicate provider, token ${token.uniqueKey.toString()} is already provided.
If you are a developer seeing this message there can be a few causes:
- You have explicitly reused the same token when providing dependencies
- You have given two tokens the same name
- You have a versioning issue resulting a side effect unexpectedly running more than once

Check your tokens to make sure that the keys are unique.
Check your dependencies version lock to make sure that those with side effects do not have
more than a single version`
      );
    }

    if (many === true) {
      const currentValue = this.providers.get(token.uniqueKey) as T | T[] | undefined;

      if (currentValue === undefined) {
        this.providers.set(token.uniqueKey, value);
        this.tokens.set(token.uniqueKey, token);
      } else {
        this.providers.set(
          token.uniqueKey,
          Array.isArray(currentValue) ? [...currentValue, value] : [currentValue, value]
        );
      }
    } else {
      this.providers.set(token.uniqueKey, value);
    }
  }

  public remove(token: AnyInjectionToken): void {
    this.verifyToken(token);
    this.providers.delete(token.uniqueKey);
    this.tokens.delete(token.uniqueKey);
  }

  public reset(): void {
    this.providers.clear();
    this.tokens.clear();
  }

  public *keys(): IterableIterator<AnyInjectionToken> {
    for (const key of this.providers.keys()) {
      const token =
        this.tokens.get(key) ??
        (this.tokens.set(key, new InjectionToken(key)).get(key) as AnyInjectionToken);

      yield token;
    }
  }
}
