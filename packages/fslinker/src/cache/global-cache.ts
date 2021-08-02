import { InjectionToken } from '../providers';
import { InjectorCache } from './cache';

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

export class GlobalInjectorCache extends InjectorCache {
  private readonly globalMap: Map<string, unknown>;

  constructor() {
    super();

    const globalObject = typeof global !== undefined ? global : window;

    if (globalObject === undefined) {
      throw new TypeError(
        `${GlobalInjectorCache.name}: Unsupported environment, the global object could not be found`
      );
    }

    if (globalObject[GLOBAL_CACHE_KEY] === undefined) {
      globalObject[GLOBAL_CACHE_KEY] = new Map();
    }

    this.globalMap = globalObject[GLOBAL_CACHE_KEY];
  }

  public get<T>(token: InjectionToken<T>): T | undefined {
    return this.globalMap.get(token.uniqueKey) as T;
  }

  public provide<T>(token: InjectionToken<T>, value: T): void {
    if (this.globalMap.has(token.uniqueKey)) {
      throw new Error(
        // tslint:disable-next-line: ter-max-len
        `${GlobalInjectorCache.name}: Duplicate provider, token ${token.uniqueKey} is already provided`
      );
    }

    this.globalMap.set(token.uniqueKey, value);
  }

  public reset(): void {
    this.globalMap.clear();
  }
}
