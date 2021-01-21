export interface ProductPromotion {
  /**
   * The promotion's identifier.
   *
   * @example '165139'
   */
  id: string;

  /**
   * The promotion's identifier.
   *
   * @example 'Sparkle Upgrade'
   */
  name: string;

  /**
   * Callout message
   *
   * @example 'Buy one get one free!'
   */
  calloutMessage: string;

  /**
   * Details of the promotion
   *
   * @example 'To purchase Sparkle click "Add to Bag"'
   */
  details: string;

  /**
   * Start date of the promotion
   *
   * @example '2019-05-03T07:00Z'
   */
  startDate: Date;

  /**
   * End date of the promotion
   *
   * @example '2021-01-31T08:00Z'
   */
  endDate: Date;

  /**
   * Image for the promotion
   *
   * @example '/images/promo.jpg'
   */
  image: string;

  /**
   * customProperties
   *
   * @example '/images/promo.jpg'
   */
  customProperties: { [propertyName: string]: any };
}
