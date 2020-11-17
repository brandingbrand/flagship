import { Product } from './Product';
import { ItemLink } from './ItemLink';

/**
 * Document representing a customer product list item.
 */
export interface CustomerProductListItem {
  /**
   * The id of this product list item.
   *
   * @example '5134131'
   */
  id?: string;

  /**
   * The priority of the item.
   *
   * @example 1
   */
  priority?: number;

  /**
   * The product item
   */
  product?: Product;

  /**
   * A link to the product.
   */
  productDetailsLink?: ItemLink;

  /**
   * The id of the product.
   */
  productId?: string;

  /**
   * Is this product list item available for access by other customers?
   */
  public: boolean;

  /**
   * The quantity of products already purchased. Decimal.
   */
  purchasedQuantity: number;

  /**
   * The quantity of this product list item. Decimal. Minimum 0.0.
   */
  quantity: number;

  /**
   * The type of the item.
   */
  type?: 'product' | 'gift_certificate';
}
