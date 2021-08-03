import { InjectionToken } from '../providers';
import { InjectorCache } from './cache';
import { GlobalInjectorCache } from './global-cache';

export class LocalInjectorCache extends InjectorCache {
  private readonly globalFallback: InjectorCache = new GlobalInjectorCache();
  private readonly map: Map<string, unknown> = new Map();

  public get<T>(token: InjectionToken<T>): T | undefined {
    return (this.map.get(token.uniqueKey) as T) ?? this.globalFallback.get(token);
  }

  public provide<T>(token: InjectionToken<T>, value: T): void {
    if (this.map.has(token.uniqueKey)) {
      throw new Error(
        // tslint:disable-next-line: ter-max-len
        `${LocalInjectorCache.name}: Duplicate provider, token ${token.uniqueKey} is already provided`
      );
    }

    this.map.set(token.uniqueKey, value);
  }

  public reset(): void {
    this.map.clear();
  }
}
