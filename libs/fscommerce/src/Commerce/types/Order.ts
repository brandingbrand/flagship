import { Address } from './Address';
import { CurrencyValue } from '../CommerceTypes';
import { CustomerAccount } from './CustomerAccount';
import { Payment } from './Payment';
import { ProductItem } from './ProductItem';
import { Shipment } from './Shipment';

/**
 * Information about a transaction that has been successfully completed.
 */
export interface Order {
  /**
   * The billing address for the order as specified by the customer.
   */
  billingAddress?: Address;

  /**
   * Label indicating the e-commerce channel on which the user completed the order.
   *
   * @example 'APP'
   */
  channelType?: string;

  /**
   * String or identifier indicating the status of the order. For Demandware this will be set
   * to '0' (not confirmed) or '2' (confirmed).
   *
   * @example '2'
   */
  confirmationStatus?: string;

  /**
   * The date and time at which the order was created.
   *
   * @example '2018-04-11T15:06:11.000Z'
   */
  creationDate?: Date;

  /**
   * The ISO 4217 code indicating the currency of the transaction.
   *
   * @see https://en.wikipedia.org/wiki/ISO_4217
   * @example 'USD'
   */
  currency?: string;

  /**
   * Information about the customer who created the order.
   */
  customerInfo?: CustomerAccount;

  /**
   * The name of the customer who created the order.
   */
  customerName: string;

  /**
   * A unique identifier for the order.
   *
   * @example 'bcs5vaOjgEQ9Uaaadk9zQIrXE6'
   */
  orderId: string;

  /**
   * The value of the tax that was applied to the order.
   *
   * @example 4.23
   */
  orderTax?: CurrencyValue;

  /**
   * A URL-safe token that can be used to reference the order.
   *
   * @example 'XizrH5hY1vB-Mxno-zfoCqTkegl3y7_OrRPGNZFlYG8'
   */
  orderToken?: string;

  /**
   * The total cost of the order including taxes and fees.
   *
   * @example 55.25
   */
  orderTotal?: CurrencyValue;

  /**
   * Information about the payments (e.g., credit card transactions) that were made
   * for the order.
   */
  payments: Payment[];

  /**
   * String or identifier indicating the payment status of the order. For Demandware the possible
   * values are 0 (not paid), 1 (partial payment), or 2 (paid)
   */
  paymentStatus?: string;

  /**
   * An array of products which comprise the order.
   */
  productItems: ProductItem[];

  /**
   * An array of shipments that comprise the order. Shipments typically represent each of the
   * boxes that will be shipped as part of the order. Each shipment can have different tracking
   * information.
   */
  shipments?: Shipment[];

  /**
   * Identifier indicating the website or property in which an order was made.
   *
   * @example 'CA'
   */
  siteId?: string;

  /**
   * String or identifier indicating the status of the order. For Demandware the possible values
   * are:
   *
   * 0 - Created
   * 1 - Exported
   * 2 - Ready
   * 3 - Export Failed
   * 4 - Open
   * 5 - Completed
   * 6 - Cancelled
   * 7 - Replaced
   * 8 - Failed
   *
   * @todo - Abstract into a more generic format and then normalize Demandware response.
   */
  status: string;
}
