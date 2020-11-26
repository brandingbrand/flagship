import { Decimal } from 'decimal.js';

/**
 * Type for price variables.
 *
 * @example '12.99'
 */

export interface CurrencyValue {
  value: Decimal;
  currencyCode: string;
}
