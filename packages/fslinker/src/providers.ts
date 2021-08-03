export class InjectionToken<T = unknown> {
  protected readonly brand: T | undefined;
  constructor(public readonly uniqueKey: string) {}
}

export type OfToken<A extends any[]> = {
  [K in keyof A]: InjectionToken<A[K]>;
};

export type OrToken<A extends any[]> = {
  [K in keyof A]: A[K] | InjectionToken<A[K]>;
};

export interface ValueProvider<T = unknown> {
  provide: InjectionToken<T>;
  useValue: T;
}

export interface BasicClassProvider<D extends unknown[], T = undefined> {
  provide: InjectionToken<T>;
  useClass: new (...dependencies: D) => T;
}

export interface InjectedClassProvider<D extends unknown[], T = undefined> {
  provide: InjectionToken<T>;
  useClass: new (...dependencies: D) => T;
  deps: OrToken<D>;
}

export type ClassProvider<D extends unknown[], T = unknown> =
  | BasicClassProvider<D, T>
  | InjectedClassProvider<D, T>;

export interface BasicFactoryProvider<T = unknown> {
  provide: InjectionToken<T>;
  useFactory: () => T;
}

export interface InjectedFactoryProvider<D extends unknown[], T = unknown> {
  provide: InjectionToken<T>;
  useFactory: (...dependencies: D) => T;
  deps: OrToken<D>;
}

export type FactoryProvider<D extends unknown[], T = unknown> =
  | BasicFactoryProvider<T>
  | InjectedFactoryProvider<D, T>;

export type Provider<D extends unknown[], T = unknown> =
  | ValueProvider<T>
  | ClassProvider<D, T>
  | FactoryProvider<D, T>;
