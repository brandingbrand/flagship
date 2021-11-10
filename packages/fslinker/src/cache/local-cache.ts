import { InjectorCache, InMemoryCache } from './cache';
import { GlobalInjectorCache } from './global-cache';

export class LocalInjectorCache extends InMemoryCache implements InjectorCache {
  constructor() {
    super(new Map(), GlobalInjectorCache);
  }
}
