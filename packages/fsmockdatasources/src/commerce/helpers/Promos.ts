import Decimal from 'decimal.js';
import { DefaultCurrencyCode } from './Misc';

export const Promos: import ('@brandingbrand/fscommerce').CommerceTypes.Promo[] = [{
  id: 'valid-promo',
  code: 'VALID',
  valid: true,
  title: 'A valid promotion!',
  value: {
    currencyCode: DefaultCurrencyCode,
    value: new Decimal(1)
  }
}, {
  id: 'save',
  code: 'SAVE',
  valid: true,
  title: 'Another valid promotion!',
  value: {
    currencyCode: DefaultCurrencyCode,
    value: new Decimal(10)
  }
}, {
  id: 'invalid-promo',
  code: 'INVALID',
  valid: false,
  title: 'An invalid promotion.'
}];
