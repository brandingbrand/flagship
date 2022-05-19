import type { Base } from '../commerce/mixins';

export type Constructor<T = Base> = new (...args: any[]) => T;
export const DefaultCurrencyCode = 'USD';
