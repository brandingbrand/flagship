import { Product } from './Product';
import Pageable from './Pageable';

/**
 * Similar to a ProductIndex but with the group metadata removed
 * so that the parent can control it
 */
export interface ProductGroup<T extends Product = Product> extends Partial<Pageable> {
  /**
   * The id used to index the group
   */
  id: string;

  /**
   * An array of products comprising the group.
   */
  products: T[];

  /**
   * A human-readable title for the product group.
   *
   * @example 'Shoes'
   */
  title?: string;

  /**
   * The total number of products that comprise a product group.
   *
   * @example 100
   */
  total?: number;
}
