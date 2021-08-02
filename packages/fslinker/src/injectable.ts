import { Injector } from './injector';
import { InjectionToken } from './providers';

export const Injectable =
  <T, C extends new (...dependencies: any[]) => T>(token: InjectionToken<T>, injector?: Injector) =>
  (target: C) => {
    (injector ?? Injector).provide({ provide: token, useClass: target });
  };
