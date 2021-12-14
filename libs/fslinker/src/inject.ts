import { InjectionToken, OfToken } from './providers';

export const DEPENDENCIES_SYMBOL = Symbol('DEPENDENCIES_SYMBOL');

export interface InjectedClass<T = unknown, D extends unknown[] = any[]> {
  [DEPENDENCIES_SYMBOL]?: InjectionToken[];
  new (...deps: D): T;
}

export const Inject =
  <T>(token: InjectionToken<T>) =>
  (target: InjectedClass<T>, _key: string | symbol, index: number) => {
    const prevDependencies = target[DEPENDENCIES_SYMBOL] ?? [];

    prevDependencies[index] = token;

    target[DEPENDENCIES_SYMBOL] = prevDependencies;
  };

export const getDependencies = <T, D extends unknown[]>(target: InjectedClass<T, D>) => {
  return (target[DEPENDENCIES_SYMBOL] ?? []) as OfToken<D>;
};
