import { ProductGroupsQuery, ProductGroups } from '../CommerceTypes';

/**
 * Methods to request a group of product indexes from a data source
 */
export interface ProductGroupDataSource {
  /**
   * Fetch a group of product indexes keyed by a `groupBy`
   *
   * @param query A query including a `groupBy` used to fetch
   * product indexes from a data source and organize them by
   * @returns A dictionary of ProductIndexes grouped by the
   * `groupBy`
   */
  fetchProductGroups(query: ProductGroupsQuery): Promise<ProductGroups>;
}
