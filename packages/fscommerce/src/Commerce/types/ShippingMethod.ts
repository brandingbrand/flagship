import { CurrencyValue } from '../CommerceTypes';

/**
 * Information about a promotion for a shipping method.
 */
export interface ShippingMethodPromo {
  /**
   * A message to be presented to the user regarding the promotion.
   *
   * @example 'Free shipping on orders over $20!'
   */
  calloutMessage?: string;

  /**
   * A unique identifier for the promotion.
   *
   * @example 'bcs5vaOjgEQ9Uaaadk9zQIrXE6'
   */
  id: string;

  /**
   * A URL directing the user to view more information about the promotion.
   *
   * @example 'https://www.brandingbrand.com/freeship'
   */
  link?: string;

  /**
   * The name of the promotion
   *
   * @example 'Free Shipping'
   */
  name: string;
}

/**
 * Information about a shipping method. Examples of shipping methods are one-day, two-day,
 * standard, and so on.
 */
export interface ShippingMethod {
  /**
   * A detailed description of the shipping method.
   *
   * @example 'Receive your items in 5-7 business days.'
   */
  description?: string;

  /**
   * Identifier corresponding to an external shipping processor. These can include shipping
   * companies (DHL, FedEx, UPS, etc.) and fulfillment services.
   *
   * @example 'bcs5vaOjgEQ9Uaaadk9zQIrXE6'
   */
  externalShippingMethod?: string;

  /**
   * A unique identifier for the shipping method.
   *
   * @example 'bcs5vaOjgEQ9Uaaadk9zQIrXE6'
   */
  id: string;

  /**
   * The name of the shipping method.
   *
   * @example 'Standard'
   */
  name: string;

  /**
   * The cost of the shipping method.
   *
   * @example 4.99
   */
  price?: CurrencyValue;

  /**
   * Information about promotions to be displayed alongside the shipping method.
   */
  shippingPromotions?: ShippingMethodPromo[];
}
