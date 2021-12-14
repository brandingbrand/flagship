import {
  ContentQuery,
  ContentResource,
  ContentSearchResult
} from '../CommerceTypes';

/**
 * Methods to request content resource from a data source.
 */
export default interface ContentDataSource {
  /**
   * Fetch the content resources specified by their identifiers.
   *
   * @param {Array.<string>} ids - The identifiers corresponding to the content resources.
   *  maxItems=50, maxLength=256
   * @param {string} locale - Optional locale context
   * @returns {Promise.<Array.<ContentResource>>} A Promise representing the content resources
   */
  fetchContentResources?(ids: string[], locale?: string): Promise<ContentResource[]>;


  /**
   * Query the data source for content resources matching a specified keyword or query.
   * The search result contains only content that is online and assigned to a folder.
   *
   * @param {ContentQuery} [query] - A query object by which content resources will be queried
   * @returns {Promise.<ContentSearchResult>} A Promise representing a product index
   */
  searchContentResources?(query?: ContentQuery): Promise<ContentSearchResult>;
}
