import type { AnyInjectionToken, InjectionToken } from '../providers';

import type { InjectorCache } from './cache';
import { InMemoryCache } from './cache';

// In order for the linker to be deterministic and used
// across bundles the key needs to be a statically known
// value that can be referenced in each bundle independently
// as such a private symbol would not be suitable.
const GLOBAL_CACHE_KEY = '__FLAGSHIP_LINKER_GLOBAL_CACHE__';

declare global {
  // eslint-disable-next-line no-var, @typescript-eslint/naming-convention, import/no-mutable-exports -- Used to declare globally on the global object
  export var __FLAGSHIP_LINKER_GLOBAL_CACHE__: Map<string, unknown>;
}

export class GlobalInjectorCache extends InMemoryCache implements InjectorCache {
  private static readonly cache: GlobalInjectorCache = new GlobalInjectorCache();

  public static get<T>(token: InjectionToken<T>): T | undefined {
    return this.cache.get(token);
  }

  public static getMany<T>(token: InjectionToken<T, 'many'>): T[] {
    return this.cache.getMany(token);
  }

  public static has(token: InjectionToken): boolean {
    return this.cache.has(token);
  }

  public static provide<T>(
    token: InjectionToken<T, 'many' | 'single'>,
    value: T,
    many?: boolean
  ): void {
    this.cache.provide(token, value, many);
  }

  public static remove(token: AnyInjectionToken): void {
    this.cache.remove(token);
  }

  public static reset(): void {
    this.cache.reset();
  }

  public static keys(): IterableIterator<AnyInjectionToken> {
    return this.cache.keys();
  }

  constructor() {
    // eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error -- Node Type
    // @ts-ignore ignore node specific type
    const globalObject = typeof global !== 'undefined' ? (global as typeof globalThis) : window;

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- Cover uncommon case
    if (globalObject === undefined) {
      throw new ReferenceError(
        `${GlobalInjectorCache.name}: Unsupported environment, the global object could not be found`
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- Cover uncommon case
    if (globalObject[GLOBAL_CACHE_KEY] === undefined) {
      globalObject[GLOBAL_CACHE_KEY] = new Map();
    }

    super(globalObject[GLOBAL_CACHE_KEY]);
  }
}
