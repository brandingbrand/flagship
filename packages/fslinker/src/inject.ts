import { InjectionToken, OfToken } from './providers';

const DEPENDENCIES_SYMBOL = Symbol('DEPENDENCIES_SYMBOL');

interface InjectedClass<D extends unknown[], T = unknown> {
  [DEPENDENCIES_SYMBOL]?: InjectionToken[];
  new (...deps: D): T;
}

export const Inject =
  (token: InjectionToken) =>
  <D extends unknown[], T = unknown>(
    target: InjectedClass<D, T>,
    _key: string | symbol,
    index: number
  ) => {
    const prevDependencies = target[DEPENDENCIES_SYMBOL] ?? [];

    prevDependencies[index] = token;

    target[DEPENDENCIES_SYMBOL] = prevDependencies;
  };

export const getDependencies = <D extends unknown[], T = unknown>(target: InjectedClass<D, T>) => {
  return (target[DEPENDENCIES_SYMBOL] ?? []) as OfToken<D>;
};
