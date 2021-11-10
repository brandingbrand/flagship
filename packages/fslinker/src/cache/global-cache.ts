import { InjectionToken } from '../providers';
import { InjectorCache, InMemoryCache } from './cache';

// In order for the linker to be deterministic and used
// across bundles the key needs to be a statically known
// value that can be referenced in each bundle independently
// as such a private symbol would not be suitable.
const GLOBAL_CACHE_KEY = '__FLAGSHIP_LINKER_GLOBAL_CACHE__';

declare global {
  interface Window {
    [GLOBAL_CACHE_KEY]: Map<string, unknown>;
  }

  namespace NodeJS {
    interface Global {
      [GLOBAL_CACHE_KEY]: Map<string, unknown>;
    }
  }
}

export class GlobalInjectorCache extends InMemoryCache implements InjectorCache {
  public static get<T>(token: InjectionToken<T>): T | undefined {
    return this.cache.get(token);
  }

  public static provide<T>(token: InjectionToken<T>, value: T): void {
    this.cache.provide(token, value);
  }

  public static remove(token: InjectionToken): void {
    this.cache.remove(token);
  }

  public static reset(): void {
    this.cache.reset();
  }

  private static cache: GlobalInjectorCache = new GlobalInjectorCache();

  constructor() {
    const globalObject = typeof global !== undefined ? global : window;

    if (globalObject === undefined) {
      throw new ReferenceError(
        `${GlobalInjectorCache.name}: Unsupported environment, the global object could not be found`
      );
    }

    if (globalObject[GLOBAL_CACHE_KEY] === undefined) {
      globalObject[GLOBAL_CACHE_KEY] = new Map();
    }

    super(globalObject[GLOBAL_CACHE_KEY]);
  }
}
