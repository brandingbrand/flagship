import { CurrencyValue, ProductPromotion } from '../CommerceTypes';
import { Image } from './Image';
import { Option, OptionValue } from './Option';
import { ReviewDetails } from '../../Review/ReviewTypes';

/**
 * Information describing the state of a product and what actions a user is able to perform
 * with the product.
 */
export interface Inventory {
  /**
   * Whether a product is in stock and able to be ordered.
   */
  orderable: boolean;

  /**
   * Whether a product can be ordered when it's out of stock.
   */
  backorderable?: boolean;

  /**
   * Whether a product can be ordered before it becomes available.
   */
  preorderable?: boolean;

  /**
   * The quantity of a product available for ordering.
   */
  stock?: number;
}

/**
 * Information about a product SKU. Products with size and/or color options typically have
 * each possible combination represented as a variant.
 */
export interface Variant {
  /**
   * The internal identifier of the variant.
   *
   * @example '1351411'
   */
  id: string;

  /**
   * An array of key/value pairs indicating specific attributes about a variant.
   *
   * @example [{
   *   name: 'Color',
   *   value: 'Red'
   * }]
   */
  optionValues: OptionValue[];

  /**
   * The current offer price for the variant.
   *
   * @example '12.49'
   */
  price?: CurrencyValue;

  /**
   * The original price of the variant. Typically displayed as crossed-out when a variant
   * is on sale.
   *
   * @example '29.99'
   */
  originalPrice?: CurrencyValue;

  /**
   * The title of the variant.
   *
   * @example 'Medium Beige'
   */
  title?: string;

  /**
   * An array of images of the variant.
   */
  images?: Image[];

  /**
   * Whether or not the variant is available. If undefined the variant is assumed to
   * be available.
   */
  available?: boolean;
}

/**
 * Basic information about a product that is reusable across interfaces.
 */
export interface BaseProduct {
  /**
   * The name of the product.
   *
   * @example 'Kingsford 24' Charcoal Grill'
   */
  title: string;

  /**
   * A SEO slug for the product. Used as a human-readable portion of the URL
   * to access the product.
   *
   * @example 'Kingsford-24-Charcoal-Grill'
   */
  handle?: string;

  /**
   * The brand or manufacturer of a product.
   *
   * @example 'Kingsford'
   */
  brand?: string;

  /**
   * A description of the product.
   *
   * @example
   * 'Kingsford Charcoal Grill comes with a cast iron cooking grid and 360 sq in of cooking space.'
   */
  description?: string;

  /**
   * An array of images of the product.
   */
  images?: Image[];

  /**
   * The current offer price of the product.
   *
   * @example '84.98'
   */
  price?: CurrencyValue;

  /**
   * The original price of the product.
   *
   * @example '105.00'
   */
  originalPrice?: CurrencyValue;

  /**
   * Whether or not the product is available. If undefined the product is assumed to
   * be available.
   */
  available?: boolean;

  /**
   * An array of options for the product. For example a 1 Year Warranty.
   */
  options?: Option[];

  /**
   * An array of variants for the product. For example alternative sizes or colors.
   */
  variants?: Variant[];

  /**
   * The reviews for this product.
   */
  review?: ReviewDetails;

  /**
   * The current inventory for the product.
   */
  inventory?: Inventory;
}

/**
 * Information about a product.
 */
export interface Product extends BaseProduct {
  /**
   * The product's identifier.
   *
   * @example '165139'
   */
  id: string;

  /**
   * An array of promotional text items for the product.
   *
   * @example 'Buy one get one free!'
   */
  promotions?: string[];

  /**
   * An array of promotions for the product with details.
   *
   * @example 'Buy one get one free!'
   */
  productPromotions?: ProductPromotion[];

  /**
   * An id of the primary category
   *
   * @example 'skincare'
   */
  primaryCategoryId?: string;

  /**
   * The master product information. Only for types master, variation group and variant.
   */
  master?: {
    id?: string;
    orderable?: boolean;
    price?: CurrencyValue;
  };

  /**
   * Identifier used to associate a product with a third-party review provider.
   *
   * @example '165139'
   */
  reviewId?: string;
}
