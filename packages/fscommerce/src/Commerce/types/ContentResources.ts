/**
 * Information describing the content resource
 */
export interface ContentResource {
  /**
   * The id of the content asset.
   */
  id: string;

  /**
   * The localized content asset name.
   */
  name: string;

  /**
   * The localized content asset description.
   */
  description: string;

  /**
   * The localized content asset page description.
   */
  pageDescription: string;

  /**
   * The localized content asset page description.
   */
  pageKeywords: string;

  /**
   * The localized content asset page title.
   */
  pageTitle: string;

  /**
   * Custom properties.
   */
  customProperties: { [key: string]: string };
}

/**
 * Information describing the content search result
 */
export interface ContentSearchResult {
  /**
   * The number of returned documents.
   */
  count: number;

  /**
   * The sorted array of search hits. Can be empty.
   */
  hits: ContentResource[];

  /**
   * The query String that was searched for.
   */
  query: string;

  /**
   * The sorted array of search refinements. Can be empty.
   */
  refinements: string;

  /**
   * Map of selected refinement attribute id/value(s) pairs.
   * The sorting order is the same like in request URL.
   */
  selectedRefinements: { [key: string]: string };

  /**
   * The zero-based index of the first search hit to include in the result.
   * minIntegerValue=0
   */
  start: number;

  /**
   * The total number of documents.
   */
  total: number;
}

/**
 * Document representing a search refinement attribute.
 */
export interface ContentSearchRefinement {
  /**
   * The id of the search refinement attribute. In the case of an attribute refinement,
   * this is the attribute id. Custom attributes are marked by the prefix "c_".
   */
  attributeId: string;

  /**
   * The localized label of the refinement.
   */
  label: string;

  /**
   * The sorted array of refinement values. The array can be empty.
   */
  values: ContentSearchRefinementValue[];
}

/**
 * Document representing a search refinement value.
 */
export interface ContentSearchRefinementValue {
  /**
   * The localized description of the refinement value.
   */
  description: string;

  /**
   * The number of search hits (0 or more) when selecting the refinement value.
   */
  hitCount: number;

  /**
   * The localized label of the refinement value.
   */
  label: string;

  /**
   * The optional presentation id associated with the refinement value.
   * The presentation id can be used, for example, to associate an id with an HTML widget.
   */
  presentationId: string;

  /**
   * The refinement value. In the case of an attribute refinement, this is the bucket,
   * the attribute value, or a value range. In the case of a content folder refinement,
   * this is the folder id.
   */
  value: string;

  /**
   * The array of hierarchical refinement values. This array can be empty.
   */
  values: ContentSearchRefinementValue[];
}

/**
 * Document representing a content search query.
 */
export interface ContentQuery {
  /**
   * The maximum number of instances per request. Default value is 25.
   * maxIntegerValue=200, minIntegerValue=1
   */
  count: number;

  /**
   * The locale context.
   */
  locale: string;

  /**
   * The query phrase to search for.
   * maxLength=50
   */
  q: string;

  /**
   * Parameter that represents a refinement attribute/value(s) pair.
   * Refinement attribute id and value(s) are separated by '='.
   * Multiple values are supported by a sub-set of refinement attributes and can be provided
   * by separating them using a pipe (URL encoded = "|"). Value ranges can be specified like this:
   * refine=foo=(100..500)
   * Multiple refine parameters can be provided by adding an underscore in combination
   * with an integer counter right behind the parameter name and a counter range 1..9.
   * I.e. refine_1=c_refinementType=type1|type2|type3.
   * The following system refinement attribute ids are supported:
   * fdid: Allows to refine per single content folder id.
   * Multiple folder ids are not supported.
   */
  refine: string;

  /**
   * Parameter that represents a sorting attribute/value(s) pair.
   * Sorting attribute id and value are separated by '='.
   * The value describes the sort direction.
   * Possible values are 'asc' and 'desc', for ascending or descending sort direction.
   * I.e. sort=c_myAttribute=desc.
   * Precondition: You have to select your sorting attributes in
   * Business Manager > YourSite > Search Indexes > Content Index > Sorting Attributes.
   */
  sort: string;


  /**
   * The result set index to return the first instance for. Default value is 0.
   * minIntegerValue=0
   */
  start: number;
}
