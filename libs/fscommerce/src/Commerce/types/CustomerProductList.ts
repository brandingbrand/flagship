import type { CustomerProductListItem } from './CustomerProductListItem';
import type { CustomerProductListRegistrant } from './CustomerProductListRegistrant';
import type { ItemLink } from './ItemLink';
import type { ProductListEvent } from './ProductListEvent';
import type { ProductListShippingAddress } from './ProductListShippingAddress';

/**
 * Document representing a customer product List.
 */
export interface CustomerProductList {
  /**
   * The coRegistrant of this product list.
   */
  coRegistrant?: CustomerProductListRegistrant;

  /**
   * Returns the value of attribute 'creationDate'.
   */
  creationDate?: Date;

  /**
   * The resource link to the current shipping address of this customer product list.
   */
  currentShippingAddressLink?: ItemLink;

  /**
   * The list of customer product list items.
   */
  items: CustomerProductListItem[];

  /**
   * The description of this product list.
   */
  description: string;

  /**
   * The event of this product list.
   */
  event?: ProductListEvent;

  /**
   * The id of this product list.
   */
  id?: string;

  /**
   * The resource link to the items of this customer product list.
   */
  itemsLink?: ItemLink;

  /**
   * Returns the value of attribute 'lastModified'.
   */
  modifiedDate?: Date;

  /**
   * The name of this product list.
   */
  name: string;

  /**
   * The resource link to the post event shipping address of this customer product list.
   */
  postEventShippingAddressLink?: ItemLink;

  /**
   * The abbreviated shipping address of this product list representing what anonymous user can see.
   */
  shippingAddress?: ProductListShippingAddress;

  /**
   * Indicates whether the owner made this product list available for access by other customers.
   */
  public: boolean;

  /**
   * The registrant of this product list.
   */
  registrant?: CustomerProductListRegistrant;

  /**
   * The resource link to the shipping address of this customer product list.
   */
  shippingAddressLink?: ItemLink;

  /**
   * The type of the product list.
   */
  type?: 'custom_1' | 'custom_2' | 'custom_3' | 'gift_registry' | 'shopping_list' | 'wish_list';
}
