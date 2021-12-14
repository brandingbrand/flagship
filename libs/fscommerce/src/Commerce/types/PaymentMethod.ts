import { PaymentBankAccount } from './PaymentBankAccount';
import { PaymentCard } from './PaymentCard';

/**
 * Information about a payment method saved in a user's account and/or used to pay
 * for an order.
 */
export interface BasePaymentMethod {
  /**
   * The routing number of the bank when a bank account is specified.
   *
   * @example '183401681'
   */
  bankRoutingNumber?: string;

  /**
   * The code of a saved gift certificate.
   *
   * @example '1234123413241324'
   */
  giftCertificateCode?: string;

  /**
   * A unique identifier for the saved payment method.
   *
   * @example 'bcs5vaOjgEQ9Uaaadk9zQIrXE6'
   */
  id?: string;

  /**
   * The masked code of a saved gift certificate.
   *
   * @example 'XXXXXXXXXXXX1234'
   */
  maskedGiftCertificateCode?: string;

  /**
   * Information about a bank account if used as the saved payment method.
   */
  paymentBankAccount?: PaymentBankAccount;

  /**
   * Information about a credit, debit, or loyalty card if used as the saved payment method.
   */
  paymentCard?: PaymentCard;

  /**
   * Identifier for the type saved payment.
   *
   * @example 'CREDIT_CARD
   */
  paymentMethodId?: string;
}

/**
 * Information about a payment method such as credit card or bank account. This is typically
 * used to represent methods that a user has saved to their account.
 */
export interface PaymentMethod extends BasePaymentMethod {
  /**
   * The creation date of the saved payment method.
   *
   * @example '2018-04-11T15:06:11.000Z'
   */
  creationDate?: Date;

  /**
   * The date in which a saved payment method was last modified.
   *
   * @example '2018-04-11T15:06:11.000Z'
   */
  modifiedDate?: Date;
}
