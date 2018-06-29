import { Decimal } from 'decimal.js';
import { CommerceTypes } from '@brandingbrand/fscommerce';

export function makeCurrency(
  price: string | number | undefined,
  currencyCode: string
) : CommerceTypes.CurrencyValue | undefined {
  if (price === undefined || price === null) {
    return undefined;
  }

  return {
    value: new Decimal(price),
    currencyCode
  };
}
