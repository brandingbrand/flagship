import type {} from 'reflect-metadata';

import type { InjectedClass } from './inject';
import { DEPENDENCIES_SYMBOL } from './inject';
import { Injector } from './injector';
import { InjectionToken } from './providers';

export const makeInjectable = <T>(target: InjectedClass<T>): InjectionToken<T> => {
  const paramTypes = (Reflect.getMetadata('design:paramtypes', target) ?? []) as InjectionToken[];

  // eslint-disable-next-line fp/no-mutating-assign -- used to merge two classes
  Object.assign(target, new InjectionToken(Symbol(target.name)));
  const dependencies = target[DEPENDENCIES_SYMBOL] ?? [];
  for (const [i, type] of paramTypes.entries()) {
    if (typeof type === 'function' && 'uniqueKey' in type && dependencies[i] === undefined) {
      dependencies[i] = type;
    }
  }

  target[DEPENDENCIES_SYMBOL] = dependencies;

  return target as unknown as InjectionToken<T>;
};

export const Injectable =
  <T>(tokenOrInjector?: InjectionToken<T> | Injector, optionalInjector?: Injector) =>
  (target: InjectedClass<T>) => {
    const token = tokenOrInjector instanceof InjectionToken ? tokenOrInjector : undefined;
    const injector = tokenOrInjector instanceof Injector ? tokenOrInjector : optionalInjector;

    makeInjectable(target);

    const injectorToken = token ?? (target as unknown as InjectionToken);
    if (injectorToken.automatic && !(injector ?? Injector).has(injectorToken)) {
      (injector ?? Injector).provide({
        provide: injectorToken,
        useClass: target,
        async: injectorToken.sync === 'async',
      });
    }
  };
