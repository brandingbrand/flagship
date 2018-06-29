import { CurrencyValue } from '../CommerceTypes';
import { BasePaymentMethod } from './PaymentMethod';

/**
 * Information about a single payment made against an order.
 */
export interface Payment extends BasePaymentMethod {
  /**
   * The monetary amount of the payment.
   *
   * @example 33.49
   */
  amount?: CurrencyValue;

  /**
   * Identifier indicating a customer's saved payment when applicable.
   *
   * @example 'bcs5vaOjgEQ9Uaaadk9zQIrXE6'
   */
  customerPaymentId?: string;
}
