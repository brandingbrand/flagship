/**
 * Information about brands that are to be suggested as a user executes a search.
 */
export interface BrandSuggestions {
  /**
   * An array of suggested brand titles.
   *
   * @example [{
   *   title: 'BB Party Supplies'
   * }]
   */
  brands: BrandSuggestion[];
}

/**
 * Information about a brand that is to be suggested as a user executes a search.
 */
export interface BrandSuggestion {
  /**
   * The title of the suggested brand.
   *
   * @example 'BB Party Supplies'
   */
  title: string;
}

/**
 * Information about categories that are to be suggested as a user executes a search.
 */
export interface CategorySuggestions {
  /**
   * An array of suggested category metadata.
   *
   * @example [{
   *   categoryId: '1531413',
   *   title: 'Balloons'
   * }]
   */
  categories: CategorySuggestion[];
}

/**
 * Information about a category that is to be suggested as a user executes a search.
 */
export interface CategorySuggestion {
  /**
   * A unique identifier for a suggested category.
   *
   * @example '1531413'
   */
  categoryId: string;

  /**
   * The title of a suggested category.
   *
   * @example 'Party Supplies'
   */
  title: string;
}

/**
 * Information about products that are to be suggested as a user executes a search.
 */
export interface ProductSuggestions {
  /**
   * An array of suggested product metadata.
   *
   * @example [{
   *   productId: '1534131',
   *   title: 'Big Red Balloon'
   * }]
   */
  products: ProductSuggestion[];
}

/**
 * Information about a product that is to be suggested as a user executes a search.
 */
export interface ProductSuggestion {
  /**
   * The suggested product's identifier.
   *
   * @example '165139'
   */
  productId: string;

  /**
   * The name of the suggested product.
   *
   * @example 'Kingsford 24' Charcoal Grill'
   */
  title: string;
}

/**
 * Ambigious query only results that have no real categorization that are meant
 * to lead the user to another search
 */
export interface QuerySuggestion {
  /**
   * The actual suggested query
   *
   * @example 'indigo jeans'
   */
  value: string;

  /**
   * A metadata value that represents how popular this query value is in relation to other queries.
   * Ex: Algolia calls this value 'popularity'
   *
   */
  rank?: number;
}

export interface QuerySuggestions {
  /**
   * An array of suggested product metadata.
   *
   * @example [{
   *   value: 'red shirt',
   *   rank: 2
   * }]
   */
  queries: QuerySuggestion[];
}

/**
 * Encapsulation of suggested brands, categories, and products for a specified query.
 */
export interface SearchSuggestion {
  /**
   * The query that triggered the search suggestions.
   */
  query: string;

  /**
   * Suggested brands for the specified query.
   */
  brandSuggestions?: BrandSuggestions;

  /**
   * Suggested categories for the specified query.
   */
  categorySuggestions?: CategorySuggestions;

  /**
   * Suggested products for the specified query.
   */
  productSuggestions?: ProductSuggestions;

  /**
   * Query suggestions that have no real categorization
   *
   * example: An autocomplete dropdown that gives you search terms after typing in 3 letters
   */
  querySuggestions?: QuerySuggestions;
}
