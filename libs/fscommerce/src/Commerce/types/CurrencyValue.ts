import type { Decimal } from 'decimal.js';

export interface CurrencyValue {
  value: Decimal;
  currencyCode: string;
}
