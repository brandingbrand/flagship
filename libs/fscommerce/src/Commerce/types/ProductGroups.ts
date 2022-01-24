import { Product } from './Product';
import { ProductGroup } from './ProductGroup';

/**
 * This is like an indexes of product indexes
 */
export interface ProductGroups<T extends Product = Product> {
  /**
   * The id of the product group
   */
  id: string;

  /**
   * The title of all the products in the group
   */
  title: string;

  /**
   * A record of product groups keyed by a `groupId`
   */
  groups: Record<string, ProductGroup<T>>;
}
