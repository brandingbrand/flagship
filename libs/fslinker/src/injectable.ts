import 'reflect-metadata';

import type { InjectedClass } from './inject';
import { DEPENDENCIES_SYMBOL } from './inject';
import { Injector } from './injector';
import { InjectionToken } from './providers';

export const Injectable =
  <T>(tokenOrInjector?: InjectionToken<T> | Injector, optionalInjector?: Injector) =>
  (target: InjectedClass<T>) => {
    const token = tokenOrInjector instanceof InjectionToken ? tokenOrInjector : undefined;
    const injector = tokenOrInjector instanceof Injector ? tokenOrInjector : optionalInjector;

    const paramTypes = (Reflect.getMetadata('design:paramtypes', target) ?? []) as InjectionToken[];

    Object.assign(target, new InjectionToken(Symbol(target.name)));
    const prevDependencies = target[DEPENDENCIES_SYMBOL] ?? [];
    for (const [i, type] of paramTypes.entries()) {
      if (typeof type === 'function' && 'uniqueKey' in type && prevDependencies[i] === undefined) {
        prevDependencies[i] = type;
      }
    }

    target[DEPENDENCIES_SYMBOL] = prevDependencies;

    const injectorToken = token ?? (target as unknown as InjectionToken);
    if (!(injector ?? Injector).has(injectorToken)) {
      (injector ?? Injector).provide({
        provide: injectorToken,
        useClass: target,
      });
    }
  };
