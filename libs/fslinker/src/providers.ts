export class InjectionToken<T = unknown, ManyType extends 'many' | 'single' = 'single'> {
  constructor(public readonly uniqueKey: string | symbol, public readonly many?: ManyType) {}
  protected readonly brand: T | undefined;
}

export type OfToken<A extends unknown[]> = {
  [K in keyof A]: InjectionToken<A[K]>;
};

export type OrToken<A extends unknown[]> = {
  [K in keyof A]: A[K] | InjectionToken<A[K]>;
};

export type ValueProvider<
  T = unknown,
  ManyType extends 'many' | 'single' = 'single'
> = ManyType extends 'many'
  ? { provide: InjectionToken<T, ManyType>; useValue: T; many: true }
  : { provide: InjectionToken<T, ManyType>; useValue: T; many?: false };

// The `many?: boolean;` vs `many?: false;` checks are made
// so that `single` tokens not provided with `many` which
// would cause them to unexpected have Array values
// at run type with no TypeScript errors the `many`
// tokens on the other hand have checks to ensure
// that arrays are always returned

export type BasicClassProvider<
  D extends unknown[],
  T = undefined,
  ManyType extends 'many' | 'single' = 'single'
> = ManyType extends 'many'
  ? {
      provide: InjectionToken<T, ManyType>;
      useClass: new (...dependencies: D) => T;
      many?: boolean;
    }
  : {
      provide: InjectionToken<T, ManyType>;
      useClass: new (...dependencies: D) => T;
      many?: false;
    };

export type InjectedClassProvider<
  D extends unknown[],
  T = undefined,
  ManyType extends 'many' | 'single' = 'single'
> = ManyType extends 'many'
  ? {
      provide: InjectionToken<T, ManyType>;
      useClass: new (...dependencies: D) => T;
      deps: OrToken<D>;
      many?: boolean;
    }
  : {
      provide: InjectionToken<T, ManyType>;
      useClass: new (...dependencies: D) => T;
      deps: OrToken<D>;
      many?: false;
    };

export type ClassProvider<
  D extends unknown[],
  T = unknown,
  ManyType extends 'many' | 'single' = 'single'
> = BasicClassProvider<D, T, ManyType> | InjectedClassProvider<D, T, ManyType>;

export type BasicFactoryProvider<
  T = unknown,
  ManyType extends 'many' | 'single' = 'single'
> = ManyType extends 'many'
  ? {
      provide: InjectionToken<T, ManyType>;
      useFactory: () => T;
      many?: boolean;
    }
  : {
      provide: InjectionToken<T, ManyType>;
      useFactory: () => T;
      many?: false;
    };

export type InjectedFactoryProvider<
  D extends unknown[],
  T = unknown,
  ManyType extends 'many' | 'single' = 'single'
> = ManyType extends 'many'
  ? {
      provide: InjectionToken<T>;
      useFactory: (...dependencies: D) => T;
      deps: OrToken<D>;
      many?: boolean;
    }
  : {
      provide: InjectionToken<T>;
      useFactory: (...dependencies: D) => T;
      deps: OrToken<D>;
      many?: false;
    };

export type FactoryProvider<
  D extends unknown[],
  T = unknown,
  ManyType extends 'many' | 'single' = 'single'
> = BasicFactoryProvider<T, ManyType> | InjectedFactoryProvider<D, T, ManyType>;

export type Provider<
  D extends unknown[],
  T = unknown,
  ManyType extends 'many' | 'single' = 'single'
> = ClassProvider<D, T, ManyType> | FactoryProvider<D, T, ManyType> | ValueProvider<T, ManyType>;
