/**
 * Interface that prescribes options that can be provided to the commerce source method to
 * add a product to the product list for the customer.
 */
export interface ProductListAddItemOptions {
  /**
   * This is the type of the item to be added to the customer's product list.
   *
   * @example 'product'
   */
  type: string;

  /**
   * This is the priority of the item to be added to the customer's product list.
   *
   * @example 1
   */
  priority?: number;

  /**
   * This is the flag whether the item to be added to the customer's product list is public.
   *
   * @example true
   */
  public?: boolean;

  /**
   * This is the id (sku) of the product related to the item to be added to the customer's product
   * list. It is mandatory for 'product' item type and it must be a valid product id,
   * otherwise ProductListProductIdMissingException or ProductListProductNotFoundException
   * will be thrown.
   *
   * @example '234234234'
   */
  product_id: string;

  /**
   * Used for product item type only.
   * This is the quantity of the item to be added to the customer's product list.
   *
   * @example 1
   */
  quantity?: number;
}
