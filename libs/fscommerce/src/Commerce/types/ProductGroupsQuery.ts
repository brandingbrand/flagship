import { ProductQuery } from './ProductQuery';

/**
 * A query with roughly the same structure as `ProductQuery`
 * but requiring a `groupBy` and `categoryId`
 */
export interface ProductGroupsQuery extends ProductQuery {
  /**
   *
   */
  groupBy: string;

  /**
   *
   */
  categoryId: string;
}
