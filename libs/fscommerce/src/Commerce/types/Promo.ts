import { CurrencyValue } from '../CommerceTypes';

/**
 * Information about a promotion that has been applied to an order.
 */
export interface Promo {
  /**
   * A unique identifier for the promo.
   *
   * @example '51341513'
   */
  id: string;

  /**
   * The code associated with the promotion.
   *
   * @example 'SAVE20'
   */
  code: string;

  /**
   * Whether the promotion is valid.
   */
  valid: boolean;

  /**
   * The title of the promotion.
   *
   * @example 'Save 20%'
   */
  title?: string;

  /**
   * The value of the promotion. This is typically the savings on the order due to the promotion.
   *
   * @example 25.99
   */
  value?: CurrencyValue;
}
