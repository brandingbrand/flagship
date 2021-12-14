/**
 * Type that associates a link to the resource.
 */
export interface ItemLink {
  /**
   * The id of the resource.
   *
   * @example '5134131'
   */
  id?: string;

  /**
   * The target of the link.
   *
   * @example '/link/id'
   */
  link: string;

  /**
   * The link title.
   *
   * @example 'Link Title'
   */
  title: string;
}
