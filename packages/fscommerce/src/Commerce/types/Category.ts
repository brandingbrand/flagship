import { Image } from './Image';

/**
 * Information about a category. Categories contain sub-categories and/or products.
 */
export interface Category {
  /**
   * A unique identifier for a category.
   *
   * @example '1531413'
   */
  id: string;

  /**
   * The title of a category.
   *
   * @example 'Party Supplies'
   */
  title: string;

  /**
   * A SEO slug for the category. Used as the human-readable portion of the URL used to
   * access the category.
   */
  handle?: string;

  /**
   * A location of an image associated with a category.
   *
   * @example 'https://www.example.com/images/partysupplies.png'
   */
  image?: Image;

  /**
   * An array of subcategories.
   */
  categories?: Category[];

  /**
   * A title to be displayed in a browser tab for a category.
   *
   * @example 'Party Supplies from BB Party Direct'
   */
  pageTitle?: string;

  /**
   * Additional copy to be presented with the category.
   */
  pageDescription?: string;

  /**
   * Identifier indicating the data source that produced the category object. This can be useful
   * if an app receives category data from multiple sources (e.g., CMS and Demandware) and needs
   * to perform different functionality depending on the source.
   *
   * @example 'Demandware'
   */
  dataSourceType?: string;

  /**
   * An identifier representing a category's ancestor.
   */
  parentId?: string;
}
