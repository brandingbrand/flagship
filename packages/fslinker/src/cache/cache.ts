import { InjectionToken } from '../providers';

export abstract class InjectorCache {
  abstract get<T>(token: InjectionToken<T>): T | undefined;
  abstract provide<T>(token: InjectionToken<T>, value: T): void;
  abstract reset(): void;
}
