import { Dictionary } from '@brandingbrand/fsfoundation';
import { Product } from './Product';
import Pageable from './Pageable';

/**
 * An interface representing a single type of sort that can be applied to a product index.
 * Common sorts are price (high-low and low-high), rating, and popularity.
 */
export interface SortingOption {
  /**
   * A unique identifier for the sorting option.
   *
   * @example 'best-matches'
   */
  id: string;

  /**
   * A human-readable title for the sorting option.
   *
   * @example 'Best Matches'
   */
  title: string;
}

/**
 * An interface representing a single value for a single refinement.
 */
export interface RefinementValue {
  /**
   * An identifier for the value. This may not be a human-readable title.
   *
   * @example "womens-accessories-scarves"
   */
  value: string;

  /**
   * A human-readable title for the value.
   *
   * @example "Scarves"
   */
  title: string;

  /**
   * The number of products within an index that match the refinement value.
   *
   * @example 4
   */
  count?: number;
}

/**
 * An interface representing a single refinement and its available values.
 */
export interface Refinement {
  /**
   * A unique identifier for the refinement.
   *
   * @example 'cgid'
   */
  id: string;

  /**
   * A human-readable title for the refinement.
   *
   * @example 'Category'
   */
  title: string;

  /**
   * An array of values that can be selected for the refinement.
   */
  values?: RefinementValue[];
}

/**
 * Information about a ProductIndex which is a collection of related products that can
 * typically be sorted and refined by the user.
 *
 * @template T The type of Product contained in this index. Defaults to `Product`
 */
export interface ProductIndex<T extends Product = Product> extends Partial<Pageable> {
  /**
   * An array of products comprising the index.
   */
  products: T[];


  /**
   * A unique identifier for the product index category, used for vehicle filter
   *
   * @example 'shoes'
   */
  fullCategoryId?: string;

  /**
   * The total number of products that comprise a product index.
   *
   * @example 100
   */
  total?: number;

  /**
   * A keyword/search term used to generate a product index when applicable.
   *
   * @example 'shoes'
   */
  keyword?: string;

  /**
   * An array of available sorting options for the product index.
   */
  sortingOptions?: SortingOption[];

  /**
   * The identifier of the currently applied sorting method for the product index.
   *
   * @example 'price-high-to-low'
   */
  selectedSortingOption?: string;

  /**
   * An array of available refinements that a user can utilize to filter the list of products.
   * Common refinements are colors, sizes, and brands.
   */
  refinements?: Refinement[];

  /**
   * An object representing the types of refinements and values for each that have been selected
   * to filter the product index.
   *
   * @example {
   *   "cgid": ["womens"]
   * }
   */
  selectedRefinements?: Dictionary<string[]>;
}
