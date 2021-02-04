import { Address } from './Address';
import { BaseProduct, Product } from './Product';
import { CurrencyValue } from '../CommerceTypes';
import { CustomerAccount } from './CustomerAccount';
import { Payment } from './Payment';
import { Promo } from './Promo';
import { Shipment } from './Shipment';
import { ProductPromotion } from './ProductPromotion';

/**
 * Information about a cart. In Demandware transactions the cart is the base unit of a
 * transaction and as such can contain shipping and payment information in addition
 * to a list of products.
 *
 * @template T The type of cart item contained in this index. Defaults to `CartItem`
 */
export interface Cart<T extends CartItem = CartItem> {
  /**
   * The billing address associated with an order.
   */
  billingAddress?: Address;

  /**
   * Information about a customer making an order.
   */
  customerInfo?: CustomerAccount;

  /**
   * A unique identifier for a cart.
   *
   * @example '1351413'
   */
  id?: string;

  /**
   * An array of products of which the user has added to the cart.
   */
  items: T[];

  /**
   * The total cost of the products in the cart before shipping feeds and taxes have
   * been added.
   *
   * @example '12.99'
   */
  subtotal?: CurrencyValue;

  /**
   * The total cost of an order including taxes and fees.
   *
   * @example '135.25'
   */
  total?: CurrencyValue;

  /**
   * The cost for shipping an order.
   *
   * @example '12.79'
   */
  shipping?: CurrencyValue;

  /**
   * The total amount of taxes for an order.
   *
   * @example. '3.22'
   */
  tax?: CurrencyValue;

  /**
   * An array of payments describing the methods used to pay for an order.
   */
  payments?: Payment[];

  /**
   * An array of promo codes that have been added to an order.
   */
  promos?: Promo[];

  /**
   * An array of shipments for the order. Orders with more than one item can be sent via multiple
   * shipments, each having its own tracking information.
   */
  shipments?: Shipment[];

  /**
   * The total amount of cart items.
   *
   * @example. '3'
   */
  itemCount?: number;

  /**
   * An array of bonus discount line items available.
   */
  bonusDiscountLineItems?: BonusDiscountLineItem[];
}

/**
 * Information about a single item in a cart.
 */
export interface CartItem extends BaseProduct {
  /**
   * A unique identifier for a cart item. This is typically separate from the product
   * ID because a cart item describes a product as well as its quantity within a cart.
   *
   * @example '153141'
   */
  itemId: string;

  /**
   * The identifier of the product which is represented by the cart item.
   *
   * @example '1534131'
   */
  productId: string;

  /**
   * The quantity of the specified product within the cart.
   *
   * @example 3
   */
  quantity: number;

  /**
   * A SEO slug for the product. Used as a human-readable portion of the URL
   * to access the product.
   *
   * @example 'Kingsford-24-Charcoal-Grill'
   */
  handle: string;

  /**
   * The total price of a line item in the cart. This is the cost of the product
   * multiplied by its quantity.
   *
   * @example '27.99'
   */
  totalPrice?: CurrencyValue;

  /**
   * Additional information about a cart item such as a description or disclaimer.
   *
   * @example 'Ships on or before 4/16'
   */
  itemText?: string;

  /**
   * An array of promotions which apply to the cart item.
   */
  promotions?: CartPromo[];

  /**
   * A unique identifier for a bonus discount line item.
   *
   * @example '1351413'
   */
  bonusDiscountLineItemId?: string;
}

/**
 * Information about a single promotion in a cart.
 */
export interface CartPromo {
  id: string;
  text?: string;
  price?: CurrencyValue;
}

/**
 * Information about a single bonus discount line item in a cart.
 */
export interface BonusDiscountLineItem {
  /**
   * A unique identifier for a bonus discount line item.
   *
   * @example '1351413'
   */
  id?: string;

  /**
   * Maximum quantity allowed for the bonus discount line item
   *
   * @example 1
   */
  maxBonusItems?: number;

  /**
   * A unique identifier for a promotion tied to this bonus discount line item.
   *
   * @example '1351413-KJHKJ'
   */
  promotionId?: string;

  /**
   * A promotion tied to this bonus discount line item.
   */
  promotion?: ProductPromotion;

  /**
   * An array of products eligible for this bonus discount line item.
   */
  bonusProducts: Product[];
}
